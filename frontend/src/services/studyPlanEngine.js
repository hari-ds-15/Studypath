/**
 * StudyPath Client-Side Stateful Study Plan & Profile Engine
 * Ensures 100% persistent profile updates, AI plan generation, and multi-language session management.
 */

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const DEFAULT_PROFILE = {
  id: 1,
  user_id: 1,
  education_level: "Undergraduate",
  branch_major: "Computer Science & Engineering",
  selected_language: "Python",
  skill_level: "Beginner",
  career_stream: "AI Engineer",
  learning_goal: "Master Core Foundations & Systems",
  preferred_duration: "Medium (4-7 weeks)",
  daily_study_hours: 3.0,
  average_study_hours: 3.0,
  weekly_target_hours: 21.0,
  learning_speed: "Balanced",
  preferred_content_type: "Interactive & Practice",
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
      
      const daily = parsed.daily_study_hours !== undefined 
        ? parseFloat(parsed.daily_study_hours) 
        : (parsed.average_study_hours !== undefined ? parseFloat(parsed.average_study_hours) : 3.0);
      const weekly = parsed.weekly_target_hours !== undefined 
        ? parseFloat(parsed.weekly_target_hours) 
        : Math.round(daily * 7 * 10) / 10;

      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        daily_study_hours: daily,
        average_study_hours: daily,
        weekly_target_hours: weekly,
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
 * Save updated profile to localStorage and mathematically synchronize daily & weekly hours
 */
export function saveStoredProfile(updatedFields) {
  const current = getStoredProfile();

  let dailyHours = current.daily_study_hours || 3.0;
  let weeklyHours = current.weekly_target_hours || 21.0;

  if (updatedFields.daily_study_hours !== undefined || updatedFields.average_study_hours !== undefined) {
    const rawDaily = updatedFields.daily_study_hours !== undefined ? updatedFields.daily_study_hours : updatedFields.average_study_hours;
    dailyHours = Math.max(0.5, Math.min(16, parseFloat(rawDaily) || 3.0));
    weeklyHours = Math.round(dailyHours * 7 * 10) / 10;
  } else if (updatedFields.weekly_target_hours !== undefined) {
    weeklyHours = Math.max(3.5, Math.min(112, parseFloat(updatedFields.weekly_target_hours) || 21.0));
    dailyHours = Math.round((weeklyHours / 7) * 10) / 10;
  }

  const merged = {
    ...current,
    ...updatedFields,
    daily_study_hours: dailyHours,
    average_study_hours: dailyHours,
    weekly_target_hours: weeklyHours
  };

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

// Helper to format minutes into HH:MM time string
function formatTimeString(startHour, startMin, addMinutes) {
  const totalStartMinutes = startHour * 60 + startMin;
  const totalEndMinutes = totalStartMinutes + addMinutes;
  
  const sh = String(Math.floor(totalStartMinutes / 60) % 24).padStart(2, '0');
  const sm = String(totalStartMinutes % 60).padStart(2, '0');
  const eh = String(Math.floor(totalEndMinutes / 60) % 24).padStart(2, '0');
  const em = String(totalEndMinutes % 60).padStart(2, '0');

  return { start: `${sh}:${sm}`, end: `${eh}:${em}` };
}

/**
 * Generate a 7-day AI study plan tailored specifically to profile language, weak subjects, speed, and target hours.
 */
export function generateAiStudyPlan(profile = null) {
  const p = profile || getStoredProfile();
  const lang = p.selected_language || "Python";
  const stream = p.career_stream || "AI Engineer";
  const level = p.skill_level || "Beginner";
  const dailyTargetHours = p.daily_study_hours || p.average_study_hours || 3.0;
  const totalDailyMinutes = Math.round(dailyTargetHours * 60);

  const weakSubjects = (p.weak_subjects && p.weak_subjects.length > 0)
    ? p.weak_subjects
    : [`${lang} Data Structures`, "Database Systems & SQL"];
  const strongSubjects = (p.strong_subjects && p.strong_subjects.length > 0)
    ? p.strong_subjects
    : [`${lang} Programming`, `${stream} Foundations`];
  
  const weak1 = weakSubjects[0] || `${lang} Core Syntax & DSA`;
  const weak2 = weakSubjects[1] || weakSubjects[0] || "Database Systems & SQL";
  const strong1 = strongSubjects[0] || `${lang} Programming`;

  const scheduleTemplates = [
    // Monday: Language Fundamentals & Core Sandbox (2 sessions)
    {
      day: "Monday",
      startBase: { hour: 18, min: 0 },
      sessionsMeta: [
        {
          title: `Deep Dive: ${lang} (${level}) - ${weak1}`,
          subject_name: `${lang} Syntax & Logic`,
          session_type: "Video",
          weight: 0.55,
          notes: `Follow step-by-step tutorial on ${lang} core principles and trace memory execution.`
        },
        {
          title: `${lang} Interactive Practice & Problem Solving`,
          subject_name: `${lang} Practice`,
          session_type: "Practice",
          weight: 0.45,
          notes: `Implement hands-on ${lang} coding exercises with zero reference materials.`
        }
      ]
    },
    // Tuesday: Weak Subject #2 & Knowledge Testing Checkpoint (2 sessions)
    {
      day: "Tuesday",
      startBase: { hour: 18, min: 0 },
      sessionsMeta: [
        {
          title: `Applied Practice: ${weak2}`,
          subject_name: weak2,
          session_type: "Practice",
          weight: 0.55,
          notes: "Focus on optimization patterns, data flow, and practical problem implementation."
        },
        {
          title: `Knowledge Testing: ${lang} Diagnostic Checkpoint`,
          subject_name: `${lang} Assessment`,
          session_type: "Quiz",
          weight: 0.45,
          notes: `Take dynamic Knowledge Testing quiz in ${lang} to verify conceptual retention.`
        }
      ]
    },
    // Wednesday: Strong Subject Reinforcement & Active Recall (2 sessions)
    {
      day: "Wednesday",
      startBase: { hour: 18, min: 0 },
      sessionsMeta: [
        {
          title: `Advanced ${strong1} & Architecture`,
          subject_name: strong1,
          session_type: "Video",
          weight: 0.6,
          notes: `Leverage strong foundation to tackle real-world system design and ${stream} patterns.`
        },
        {
          title: `Spaced Revision: ${weak1}`,
          subject_name: weak1,
          session_type: "Revision",
          weight: 0.4,
          notes: "Feynman technique: explain core concepts from memory without looking at notes."
        }
      ]
    },
    // Thursday: Intensive Problem Solving on Priority Focus (1 deep work session)
    {
      day: "Thursday",
      startBase: { hour: 18, min: 0 },
      sessionsMeta: [
        {
          title: `Challenging Problem Sets: ${weak1} in ${lang}`,
          subject_name: `${lang} Problem Solving`,
          session_type: "Practice",
          weight: 1.0,
          notes: "Analyze edge cases, time complexity, and memory invariants."
        }
      ]
    },
    // Friday: Specialization Track Lab & Weekly Assessment (2 sessions)
    {
      day: "Friday",
      startBase: { hour: 17, min: 30 },
      sessionsMeta: [
        {
          title: `Specialization Track Lab: ${stream}`,
          subject_name: stream,
          session_type: "Practice",
          weight: 0.6,
          notes: `Build end-to-end module connecting ${lang} components to the ${stream} roadmap project.`
        },
        {
          title: `Weekly Knowledge Testing Assessment`,
          subject_name: "Weekly Review",
          session_type: "Quiz",
          weight: 0.4,
          notes: `Evaluate retention on all ${lang} and ${stream} topics covered this week.`
        }
      ]
    },
    // Saturday: Intensive Deep Work Block (2 weekend deep work sessions)
    {
      day: "Saturday",
      startBase: { hour: 10, min: 0 },
      sessionsMeta: [
        {
          title: `Weekend Deep Work: ${weak2} & Systems Engineering`,
          subject_name: weak2,
          session_type: "Video",
          weight: 0.5,
          notes: "In-depth architecture breakdown, schema design, and runtime profiling."
        },
        {
          title: `Hands-on Project Lab: ${stream} Prototype`,
          subject_name: stream,
          session_type: "Practice",
          weight: 0.5,
          notes: `Write clean, well-tested code in ${lang} and push commit to version control.`
        }
      ]
    },
    // Sunday: Spaced Repetition & Next Week Roadmap (2 sessions)
    {
      day: "Sunday",
      startBase: { hour: 11, min: 0 },
      sessionsMeta: [
        {
          title: `Weekly Spaced Repetition & Flashcard Review`,
          subject_name: "Spaced Repetition",
          session_type: "Revision",
          weight: 0.6,
          notes: `Revisit error logs, missed quiz questions, and tricky ${lang} syntax traps.`
        },
        {
          title: `Next Week Roadmap & Goal Calibration`,
          subject_name: "Academic Strategy",
          session_type: "Reading",
          weight: 0.4,
          notes: `Review analytics efficiency score and recalibrate next week's ${stream} milestones.`
        }
      ]
    }
  ];

  let idCounter = 1;
  const sessions = [];

  for (const dayItem of scheduleTemplates) {
    let currentHour = dayItem.startBase.hour;
    let currentMin = dayItem.startBase.min;

    let remainingMinutes = totalDailyMinutes;

    dayItem.sessionsMeta.forEach((meta, idx) => {
      let sessionDuration = 0;
      if (idx === dayItem.sessionsMeta.length - 1) {
        sessionDuration = Math.max(20, remainingMinutes);
      } else {
        sessionDuration = Math.max(20, Math.round(totalDailyMinutes * meta.weight));
        remainingMinutes -= sessionDuration;
      }

      const times = formatTimeString(currentHour, currentMin, sessionDuration);

      sessions.push({
        id: idCounter++,
        title: meta.title,
        subject_name: meta.subject_name,
        day_of_week: dayItem.day,
        start_time: times.start,
        end_time: times.end,
        duration_minutes: sessionDuration,
        session_type: meta.session_type,
        is_completed: false,
        notes: meta.notes
      });

      // Break between sessions (15 min)
      const nextTotalMin = currentHour * 60 + currentMin + sessionDuration + 15;
      currentHour = Math.floor(nextTotalMin / 60) % 24;
      currentMin = nextTotalMin % 60;
    });
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
  return plan.sessions || [];
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
  const targetHours = p.weekly_target_hours || 21.0;

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
