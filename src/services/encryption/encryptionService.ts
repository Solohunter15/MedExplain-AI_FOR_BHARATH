// End-to-end encryption service for medical data

import { ENCRYPTION_SETTINGS } from '@/constants'

export interface EncryptedData {
  encryptedContent: string
  iv: string
  salt: string
  authTag: string
}

export interface DecryptedData {
  content: string
}

class EncryptionService {
  private encoder = new TextEncoder()
  private decoder = new TextDecoder()

  async generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }

  async encryptData(data: string, userKey: string): Promise<EncryptedData> {
    try {
      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(ENCRYPTION_SETTINGS.IV_LENGTH))
      
      // Derive encryption key from user key and salt
      const key = await this.generateKey(userKey, salt)
      
      // Encrypt the data
      const encodedData = this.encoder.encode(data)
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encodedData
      )

      // Extract auth tag (last 16 bytes) and encrypted content
      const encryptedArray = new Uint8Array(encryptedBuffer)
      const authTag = encryptedArray.slice(-16)
      const encryptedContent = encryptedArray.slice(0, -16)

      return {
        encryptedContent: this.arrayBufferToBase64(encryptedContent),
        iv: this.arrayBufferToBase64(iv),
        salt: this.arrayBufferToBase64(salt),
        authTag: this.arrayBufferToBase64(authTag)
      }
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  async decryptData(encryptedData: EncryptedData, userKey: string): Promise<DecryptedData> {
    try {
      // Convert base64 strings back to arrays
      const salt = this.base64ToArrayBuffer(encryptedData.salt)
      const iv = this.base64ToArrayBuffer(encryptedData.iv)
      const authTag = this.base64ToArrayBuffer(encryptedData.authTag)
      const encryptedContent = this.base64ToArrayBuffer(encryptedData.encryptedContent)
      
      // Reconstruct the full encrypted buffer (content + auth tag)
      const fullEncryptedBuffer = new Uint8Array(encryptedContent.byteLength + authTag.byteLength)
      fullEncryptedBuffer.set(new Uint8Array(encryptedContent))
      fullEncryptedBuffer.set(new Uint8Array(authTag), encryptedContent.byteLength)
      
      // Derive the same key
      const key = await this.generateKey(userKey, new Uint8Array(salt))
      
      // Decrypt the data
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(iv)
        },
        key,
        fullEncryptedBuffer
      )

      const decryptedText = this.decoder.decode(decryptedBuffer)
      
      return { content: decryptedText }
    } catch (error) {
      console.error('Decryption failed:', error)
      throw new Error('Failed to decrypt data - invalid key or corrupted data')
    }
  }

  async hashData(data: string): Promise<string> {
    const encodedData = this.encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData)
    return this.arrayBufferToBase64(hashBuffer)
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  // Generate a secure random key for users
  generateSecureKey(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return this.arrayBufferToBase64(array)
  }
}

export const encryptionService = new EncryptionService()