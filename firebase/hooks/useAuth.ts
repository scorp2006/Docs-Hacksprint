'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

// Mock user for development
const mockUser = {
  uid: 'mock-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
} as User;

export function useAuth() {
  // For development, return mock user immediately
  return {
    user: mockUser,
    loading: false,
    error: null
  };
} 