export type AppViewRoute =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'virtual-lab'
  | 'misi-sains'
  | 'tantangan-kuis'
  | 'peringkat'
  | 'landing-3d';

export interface UserSession {
  name: string;
  email: string;
  role: string;
  grade: string;
  level: number;
  avatarSeed: string;
  stars: number;
  xp: number;
  streak: number;
  completedMissions: number[];
  isAuthenticated: boolean;
}

export const DEFAULT_USER: UserSession = {
  name: 'Minton Cadence',
  email: 'minton@bintangedu.id',
  role: 'Kadet Penjelajah Antariksa',
  grade: 'Kelas 5 SD',
  level: 7,
  avatarSeed: 'MT',
  stars: 1240,
  xp: 120,
  streak: 7,
  completedMissions: [1, 2],
  isAuthenticated: false,
};
