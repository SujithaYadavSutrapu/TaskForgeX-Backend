export const validateAuthInput = (email: string, password: string) => {
  
  if (!email.trim()) {
    return "Email cannot be empty";
  }

  if (!password.trim()) {
    return "Password cannot be empty";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};