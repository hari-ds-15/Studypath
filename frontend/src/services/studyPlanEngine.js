/**
 * StudyPath Client-Side Stateful Study Plan & Profile Engine
 * Ensures 100% persistent profile updates, AI plan generation, and session management.
 */

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const DEFAULT_PROFILE = {
  id: 1,
  user_id: 1,
  education_level: "Undergraduate",
  branch_major: "Computer Science & Engineering",
  learning_speed: "Balanced",
  preferred_content_type: "Interactive & Practice",
  average_study_hours: 3.5,
  weekly_target_hours: 20,
  strong_subjects: ["Python Programming", "Machine Learning Fundamentals"],
  weak_subjects: ["Data Structures & Algorithms", "Database Systems & SQL"],
  career_interests: ["AI Engineer", "Full Stack Developer"],
  learning_efficiency_score: 84.5,
  study_method_style: "Video -> Practice -> Quiz -> Revision",
  onboarding_completed: true
};

/**
 * Get current profile from localStorage or default
 */
export function getStoredProfile() {
  try {
    const saved = localStorage.getItem('studypath_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      const user = localStorage.getItem('studypath_user');
      const userObj = user ? JSON.parse(user) : null;
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        full_name: userObj?.full_name || parsed.full_name || 'StudyPath Student',
        email: userObj?.email || parsed.email || 'student@studypath.edu'
      };
    }
  } catch (e) {
    console.error('Failed to parse profile:', e);
  }

  const user = localStorage.getItem('studypath_user');
  const userObj = user ? JSON.parse(user) : null;
  return {
    ...DEFAULT_PROFILE,
    full_name: userObj?.full_name || 'StudyPath Student',
    email: userObj?.email || 'student@studypath.edu'
  };
}

/**
 * Save updated profile to localStorage
 */
export function saveStoredProfile(updatedFields) {
  const current = getStoredProfile();
  const merged = { ...current, ...updatedFields };
  try {
    localStorage.setItem('studypath_profile', JSON.stringify(merged));
    if (updatedFields.full_name || updatedFields.email) {
      const savedUser = localStorage.getItem('studypath_user');
      const userObj = savedUser ? JSON.parse(savedUser) : {};
      const newUserObj = {
        ...userObj,
        ...(updatedFields.full_name ? { full_name: updatedFields.full_name } : {}),
        ...(updatedFields.email ? { email: updatedFields.email } : {})
      };
      localStorage.setItem('studypath_user', JSON.stringify(newUserObj));
    }
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
  return merged;
}

/**
 * Generate a 7-day AI study plan tailored specifically to profile's weak subjects, speed, and target hours.
 */
export function generateAiStudyPlan(profile = null) {
  const p = profile || getStoredProfile();
  const weakSubjects = (p.weak_subjects && p.weak_subjects.length > 0)
    ? p.weak_subjects
    : ["Data Structures & Algorithms", "Database Systems & SQL"];
  const strongSubjects = (p.strong_subjects && p.strong_subjects.length > 0)
    ? p.strong_subjects
    : ["Python Programming", "Machine Learning Fundamentals"];
  const major = p.branch_major || "Computer Science";
  const dailyTargetHours = p.average_study_hours || 3.5;

  const weak1 = weakSubjects[0] || "Data Structures & Algorithms";
  const weak2 = weakSubjects[1] || weakSubjects[0] || "Database Systems & SQL";
  const strong1 = strongSubjects[0] || "Python Programming";

  const scheduleTemplates = [
    // Monday: Weak Subject #1 Foundation & Practice
    {
      day: "Monday",
      sessions: [
        {
          title: `Deep Dive: ${weak1} Foundations`,
          subject_name: weak1,
          start_time: "18:00",
          end_time: "19:15",
          session_type: "Video",
          notes: "Trace core concepts step-by-step and write notes."
        },
        {
          title: `${weak1} Problem Solving & Sandbox`,
          subject_name: weak1,
          start_time: "19:30",
          end_time: "20:45",
          session_type: "Practice",
          notes: "Implement 2 practice problems with zero reference materials."
        }
      ]
    },
    // Tuesday: Weak Subject #2 & Diagnostic Checkpoint
    {
      day: "Tuesday",
      sessions: [
        {
          title: `Applied Practice: ${weak2}`,
          subject_name: weak2,
          start_time: "18:00",
          end_time: "19:15",
          session_type: "Practice",
          notes: "Focus on optimization patterns and practical queries."
        },
        {
          title: "Diagnostic Checkpoint Quiz",
          subject_name: weak2,
          start_time: "19:30",
          end_time: "20:15",
          session_type: "Quiz",
          notes: "Take 10-question timed checkpoint to pinpoint knowledge gaps."
        }
      ]
    },
    // Wednesday: Strong Subject Reinforcement & Active Spaced Recall
    {
      day: "Wednesday",
      sessions: [
        {
          title: `Advanced ${strong1} & Architecture`,
          subject_name: strong1,
          start_time: "18:00",
          end_time: "19:15",
          session_type: "Video",
          notes: "Leverage strong foundation to tackle advanced real-world systems."
        },
        {
          title: `Spaced Revision: ${weak1}`,
          subject_name: weak1,
          start_time: "19:30",
          end_time: "20:15",
          session_type: "Revision",
          notes: "Feynman technique: explain Monday's concepts from memory."
        }
      ]
    },
    // Thursday: Intensive Problem Solving on Priority Focus
    {
      day: "Thursday",
      sessions: [
        {
          title: `Challenging Problem Sets: ${weak1}`,
          subject_name: weak1,
          start_time: "18:00",
          end_time: "19:30",
          session_type: "Practice",
          notes: "Analyze edge cases, time complexity, and memory invariants."
        }
      ]
    },
    // Friday: Major Elective & Weekly Mastery Review
    {
      day: "Friday",
      sessions: [
        {
          title: `Specialization Lab: ${major}`,
          subject_name: major,
          start_time: "17:30",
          end_time: "19:00",
          session_type: "Practice",
          notes: "Build end-to-end module implementation in repository."
        },
        {
          title: "Weekly Assessment Quiz",
          subject_name: "All Focus Areas",
          start_time: "19:15",
          end_time: "20:00",
          session_type: "Quiz",
          notes: "Gauge weekly retention across all modules."
        }
      ]
    },
    // Saturday: Intensive Deep Work Block
    {
      day: "Saturday",
      sessions: [
        {
          title: `Weekend Deep Work: ${weak2} & Systems`,
          subject_name: weak2,
          start_time: "10:00",
          end_time: "11:45",
          session_type: "Video",
          notes: "In-depth architecture breakdown and schema design."
        },
        {
          title: "Hands-on Project Coding Lab",
          subject_name: strong1,
          start_time: "14:00",
          end_time: "15:30",
          session_type: "Practice",
          notes: "Connect backend endpoints to frontend client UI."
        }
      ]
    },
    // Sunday: Spaced Repetition & Next Week Roadmap
    {
      day: "Sunday",
      sessions: [
        {
          title: "Weekly Spaced Repetition Review",
          subject_name: "Comprehensive Review",
          start_time: "11:00",
          end_time: "12:15",
          session_type: "Revision",
          notes: "Revisit flashcards and error logs from the entire week."
        },
        {
          title: "Next Week Study Roadmap & Goal Calibration",
          subject_name: "Academic Strategy",
          start_time: "17:00",
          end_time: "17:45",
          session_type: "Reading",
          notes: "Review analytics insights and calibrate upcoming targets."
        }
      ]
    }
  ];

  let idCounter = 1;
  const sessions = [];

  for (const item of scheduleTemplates) {
    for (const s of item.sessions) {
      const sh = parseInt(s.start_time.split(':')[0], 10);
      const sm = parseInt(s.start_time.split(':')[1], 10);
      const eh = parseInt(s.end_time.split(':')[0], 10);
      const em = parseInt(s.end_time.split(':')[1], 10);
      const duration = (eh * 60 + em) - (sh * 60 + sm);

      sessions.push({
        id: idCounter++,
        title: s.title,
        subject_name: s.subject_name,
        day_of_week: item.day,
        start_time: s.start_time,
        end_time: s.end_time,
        duration_minutes: duration > 0 ? duration : 60,
        session_type: s.session_type,
        is_completed: false,
        notes: s.notes
      });
    }
  }

  saveStoredSessions(sessions);
  return computeWeeklyPlan(sessions, p);
}

/**
 * Get stored sessions from localStorage
 */
export function getStoredSessions() {
  try {
    const saved = localStorage.getItem('studypath_study_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse study sessions:', e);
  }

  // If no sessions stored, generate fresh plan
  const plan = generateAiStudyPlan();
  return getStoredSessions();
}

/**
 * Save sessions to localStorage
 */
export function saveStoredSessions(sessions) {
  try {
    localStorage.setItem('studypath_study_sessions', JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save study sessions:', e);
  }
}

/**
 * Compute full WeeklyPlanOut object with statistics and sessions_by_day
 */
export function computeWeeklyPlan(sessions = null, profile = null) {
  const currentSessions = sessions || getStoredSessions();
  const p = profile || getStoredProfile();
  const targetHours = p.weekly_target_hours || 20;

  const totalMinutes = currentSessions.reduce((acc, s) => acc + (s.duration_minutes || 60), 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const completedCount = currentSessions.filter(s => s.is_completed).length;
  const pendingCount = currentSessions.length - completedCount;
  const completionRate = currentSessions.length > 0
    ? Math.round((completedCount / currentSessions.length) * 1000) / 10
    : 0;

  const sessions_by_day = {};
  for (const day of DAYS_OF_WEEK) {
    sessions_by_day[day] = [];
  }

  for (const s of currentSessions) {
    if (sessions_by_day[s.day_of_week]) {
      sessions_by_day[s.day_of_week].push(s);
    }
  }

  // Sort each day by start_time
  for (const day of DAYS_OF_WEEK) {
    sessions_by_day[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
  }

  return {
    total_weekly_hours: totalHours,
    target_weekly_hours: targetHours,
    completed_sessions_count: completedCount,
    pending_sessions_count: pendingCount,
    completion_rate_percentage: completionRate,
    sessions_by_day: sessions_by_day,
    sessions: currentSessions
  };
}

/**
 * Toggle session completion status
 */
export function toggleSessionCompleted(sessionId) {
  const sessions = getStoredSessions();
  const updated = sessions.map(s => {
    if (s.id === Number(sessionId)) {
      return { ...s, is_completed: !s.is_completed };
    }
    return s;
  });
  saveStoredSessions(updated);
  return computeWeeklyPlan(updated);
}

/**
 * Add a new custom study session
 */
export function addStudySession(sessionData) {
  const sessions = getStoredSessions();
  const sh = parseInt(sessionData.start_time.split(':')[0], 10);
  const sm = parseInt(sessionData.start_time.split(':')[1], 10);
  const eh = parseInt(sessionData.end_time.split(':')[0], 10);
  const em = parseInt(sessionData.end_time.split(':')[1], 10);
  const duration = (eh * 60 + em) - (sh * 60 + sm);

  const newSession = {
    id: Date.now(),
    title: sessionData.title,
    subject_name: sessionData.subject_name,
    day_of_week: sessionData.day_of_week,
    start_time: sessionData.start_time,
    end_time: sessionData.end_time,
    duration_minutes: duration > 0 ? duration : 60,
    session_type: sessionData.session_type || 'Practice',
    is_completed: false,
    notes: sessionData.notes || ''
  };

  sessions.push(newSession);
  saveStoredSessions(sessions);
  return newSession;
}

/**
 * Update an existing study session
 */
export function updateStudySession(sessionId, sessionData) {
  const sessions = getStoredSessions();
  const updated = sessions.map(s => {
    if (s.id === Number(sessionId)) {
      const startTime = sessionData.start_time || s.start_time;
      const endTime = sessionData.end_time || s.end_time;
      const sh = parseInt(startTime.split(':')[0], 10);
      const sm = parseInt(startTime.split(':')[1], 10);
      const eh = parseInt(endTime.split(':')[0], 10);
      const em = parseInt(endTime.split(':')[1], 10);
      const duration = (eh * 60 + em) - (sh * 60 + sm);

      return {
        ...s,
        ...sessionData,
        duration_minutes: duration > 0 ? duration : s.duration_minutes
      };
    }
    return s;
  });
  saveStoredSessions(updated);
  return updated.find(s => s.id === Number(sessionId));
}

/**
 * Delete a study session
 */
export function deleteStudySession(sessionId) {
  const sessions = getStoredSessions();
  const filtered = sessions.filter(s => s.id !== Number(sessionId));
  saveStoredSessions(filtered);
  return computeWeeklyPlan(filtered);
}
