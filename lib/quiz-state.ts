/**
 * Resets all quiz state in localStorage
 */
export function resetQuizState() {
  localStorage.removeItem("quiz_started")
  localStorage.removeItem("quiz_current_question")
  localStorage.removeItem("quiz_answers")
  localStorage.removeItem("quiz_profile")
  localStorage.removeItem("quiz_start_time")
}

/**
 * Checks if a quiz is in progress
 */
export function isQuizInProgress(): boolean {
  return localStorage.getItem("quiz_started") === "true" && !localStorage.getItem("quiz_profile")
}

/**
 * Checks if quiz results are available
 */
export function hasQuizResults(): boolean {
  return localStorage.getItem("quiz_profile") !== null
}
