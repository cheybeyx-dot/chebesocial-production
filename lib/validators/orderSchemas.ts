export function validateResolveInput(data: {
  platform: string;
  issue: string;
}) {
  if (!data.platform || data.platform.length < 2) {
    throw new Error("Invalid platform");
  }

  if (!data.issue || data.issue.length < 10) {
    throw new Error("Issue description too short");
  }

  if (data.issue.length > 1000) {
    throw new Error("Issue too long");
  }
}
