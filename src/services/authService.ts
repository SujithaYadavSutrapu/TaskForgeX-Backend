import bcrypt from "bcrypt";

const signupService = async (email: string, password: string) => {

  const hashedPassword = await bcrypt.hash(password, 10);
  return {
    email,
    password: hashedPassword,
  };
};

const loginService = async (email: string, password: string) => {
  // mock user (until DB)
  const mockUser = {
    email,
    password: await bcrypt.hash("123456", 10),
  };

  const isMatch = await bcrypt.compare(password, mockUser.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    email,
  };
};

export { signupService, loginService };