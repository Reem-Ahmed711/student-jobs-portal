function extractCVData(text) {
  const result = {};


  const nameMatch =
    text.match(/Name[:\-]\s*(.*)/i) ||
    text.match(/Full Name[:\-]\s*(.*)/i);

  result.name = nameMatch ? nameMatch[1].split("\n")[0].trim() : null;


  const emailMatch =
    text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  result.email = emailMatch ? emailMatch[0] : null;

  
  const phoneMatch = text.match(/(\+?\d{10,15})/);
  result.phone = phoneMatch ? phoneMatch[0] : null;


  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9\-_/]+/i);
  result.linkedin = linkedinMatch ? linkedinMatch[0] : null;

 
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9\-_/]+/i);
  result.github = githubMatch ? githubMatch[0] : null;

  
  const experienceMatch = text.match(
    /Experience[:\-]\s*([\s\S]*?)(Education|Skills|Projects|$)/i
  );

  result.experience = experienceMatch
    ? experienceMatch[1]
        .split("\n")
        .map((e) => e.trim())
        .filter(Boolean)
    : [];


  const projectsMatch = text.match(
    /Projects[:\-]\s*([\s\S]*?)(Experience|Education|Skills|$)/i
  );

  result.projects = projectsMatch
    ? projectsMatch[1]
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  
  const skillsMatch = text.match(
    /Skills[:\-]\s*([\s\S]*?)(Education|Experience|Projects|$)/i
  );

  result.skills = skillsMatch
    ? skillsMatch[1]
        .split(/,|\n|•/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const gpaMatch = text.match(/GPA[:\-]?\s*([0-4]\.\d+)/i);
  result.gpa = gpaMatch ? gpaMatch[1] : null;

  
  const deptMatch = text.match(/Department[:\-]\s*(.*)/i);
  result.department = deptMatch
    ? deptMatch[1].split("\n")[0].trim()
    : null;

  const yearMatch = text.match(/Year[:\-]\s*(.*)/i);
  result.academicYear = yearMatch
    ? yearMatch[1].split("\n")[0].trim()
    : null;

  const gradMatch = text.match(/Graduated[:\-]\s*(Yes|No)/i);

  result.isGraduated = gradMatch
    ? gradMatch[1].toLowerCase() === "yes"
    : null;

  
  const ageMatch = text.match(/Age[:\-]?\s*(\d{1,3})/i);
  result.age = ageMatch ? ageMatch[1] : null;

 //score
  let score = 0;

  if (result.name) score += 10;
  if (result.email) score += 10;
  if (result.phone) score += 10;
  if (result.skills.length > 0) score += 15;
  if (result.experience.length > 0) score += 15;
  if (result.projects.length > 0) score += 15;
  if (result.gpa) score += 10;
  if (result.linkedin) score += 5;
  if (result.github) score += 5;

  result.cvScore = score;


  //  VALID CV CHECK
 
  result.isValidCV =
    !!result.name &&
    !!result.email &&
    result.skills.length > 0;

  return result;
}

module.exports = extractCVData;