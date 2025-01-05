'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import { projectService } from '@/firebase/services/projectService';
import { useToast } from '@/components/ui/use-toast';
import { InviteMemberDialog } from './InviteMemberDialog';
import { useAuth } from '@/firebase/hooks/useAuth';
import { UserMinus } from 'lucide-react';

interface ProjectMembersProps {
  project: Project;
}

interface Member {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export default function ProjectMembers({ project }: ProjectMembersProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadMembers = async () => {
    try {
      const projectMembers = await projectService.getProjectMembers(project.id);
      setMembers(projectMembers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load project members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [project.id]);

  const handleRemoveMember = async (memberId: string) => {
    if (!user || user.uid === memberId) {
      toast({
        title: 'Error',
        description: 'You cannot remove yourself from the project',
        variant: 'destructive',
      });
      return;
    }

    try {
      await projectService.removeMemberFromProject(project.id, memberId);
      await loadMembers(); // Reload the members list
      toast({
        title: 'Member removed',
        description: 'Successfully removed member from the project',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading members...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Project Members</h2>
        <InviteMemberDialog projectId={project.id} />
      </div>

      <div className="divide-y">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={member.photoURL} />
                <AvatarFallback>
                  {member.displayName?.charAt(0) || member.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.displayName}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            {user?.uid !== member.id && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleRemoveMember(member.id)}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 