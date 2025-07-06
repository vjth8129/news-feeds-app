import { useEffect, useState } from 'react';
import { useApi } from './useApi';

interface ProfileData {
  user: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  };
  categories: Array<{
    id?: string;
    name?: string;
    title?: string;
    [key: string]: any;
  }>;
}

export function useProfile() {
  const { request, loading, error } = useApi();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const result = await request<ProfileData>('/user/profile', 'GET');
    if (result.data) {
      setProfileData(result.data);
    }
    return result;
  }

  return { profileData, loading, error, fetchProfile };
} 