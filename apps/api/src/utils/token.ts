import jwt from "jsonwebtoken";

export function parseTimeToMs(time: string): number {
  const match = /^(\d+)([smhd])$/.exec(time);
  if (!match) throw new Error("Invalid time format");
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error("Unknown time unit");
  }
}

export const generateToken = (
  id: string,
  email: string,
  role: string,
  expiresIn: string
): string => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET as string, {
    expiresIn: parseTimeToMs(expiresIn) / 1000,
  });
};
