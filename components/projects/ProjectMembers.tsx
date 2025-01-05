'use client';

import { useState } from 'react';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Mail, Trash2, Crown } from 'lucide-react';
import { useAuth } from '@/firebase/hooks/useAuth';

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
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // For development, just log the invitation
      console.log(`Inviting member with email: ${email}`);
      setEmail('');
    } catch (err) {
      console.error('Error inviting member:', err);
      setError('Failed to invite member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (memberId === project.ownerId) return;

    try {
      // For development, just log the removal
      console.log(`Removing member: ${memberId}`);
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Team Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage your project team and invite new members
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Teammate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading || !email.trim()}>
                  {loading ? 'Sending Invite...' : 'Send Invite'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="divide-y">
        {project.members.map((memberId) => (
          <div
            key={memberId}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                {memberId[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium leading-none">
                  {memberId === project.ownerId ? (
                    <span className="flex items-center">
                      User {memberId.slice(0, 8)}
                      <Crown className="ml-2 h-4 w-4 text-yellow-500" />
                    </span>
                  ) : (
                    `User ${memberId.slice(0, 8)}`
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {memberId === project.ownerId ? 'Project Owner' : 'Team Member'}
                </p>
              </div>
            </div>
            {user?.uid === project.ownerId && memberId !== project.ownerId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveMember(memberId)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 