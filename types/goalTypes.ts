// Milestone type
export type Milestone = {
  id: number;
  targetValue: number;
  action: string;
};

// Checkin type
export type CheckinType = {
  id: number;
  goalId: number;
  checkinDate: string;
  value: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

// Progress type
export type Progress = {
  current: number;
  target: number;
  percentage: number;
  frequencyUnit: string;
};

// NextMilestone type
export type NextMilestone = {
  id: number;
  targetValue: number;
  action: string;
};

// Cause type
export type Cause = {
  id: number;
  name: string;
  emoji: string;
  conversionRate: number;
  currentTotal: number;
  Milestones: Milestone[];
};

// Goal type
export type Goal = {
  id: number;
  userId: number;
  title: string;
  targetFrequency: number;
  frequencyUnit: string;
  causeId: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE" | string;
  createdAt: string;
  updatedAt: string;
  Cause: Cause;
  Checkins: CheckinType[];
  progress: Progress;
  nextMilestone: NextMilestone;
};
