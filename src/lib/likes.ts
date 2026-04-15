'use client';

export const toggleLike = (
  projectId: string,
  likedProjects: Set<string>,
  setLikedProjects: (value: React.SetStateAction<Set<string>>) => void
) => {
  const newLikedProjects = new Set(likedProjects);

  if (newLikedProjects.has(projectId)) {
    newLikedProjects.delete(projectId);
  } else {
    newLikedProjects.add(projectId);
  }
  
  setLikedProjects(newLikedProjects);
  localStorage.setItem('likedProjects', JSON.stringify(Array.from(newLikedProjects)));
};
