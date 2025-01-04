'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase/hooks/useAuth';
import { projectService } from '@/firebase/services/projectService';
import { Project } from '@/types';

interface ProjectMembersProps {
  project: Project;
}

export default function ProjectMembers({ project }: ProjectMembersProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // We need to add this method to projectService
      await projectService.inviteMember(project.id, email.trim());
      setEmail('');
    } catch (err) {
      console.error('Error inviting member:', err);
      setError('Failed to invite member. Please check the email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!user || memberId === project.ownerId) return;

    try {
      // We need to add this method to projectService
      await projectService.removeMember(project.id, memberId);
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  return (
    <div className="w-72">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold mb-4">Project Members</h3>
        
        {user?.uid === project.ownerId && (
          <form onSubmit={handleInviteMember} className="mb-4">
            <div className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to invite"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Inviting...' : 'Invite Member'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        )}

        <div className="space-y-2">
          {project.members.map((memberId) => (
            <div
              key={memberId}
              className="flex items-center justify-between py-2 border-b last:border-b-0"
            >
              <span className="text-sm">
                {memberId === project.ownerId ? '👑 Owner' : 'Member'}
              </span>
              {user?.uid === project.ownerId && memberId !== project.ownerId && (
                <button
                  onClick={() => handleRemoveMember(memberId)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 