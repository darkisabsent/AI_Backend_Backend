import { UserProfile } from '@prisma/client';

export function buildAIContext(profile: UserProfile): string {
  const lines: string[] = [];

  lines.push(`My name is ${profile.firstName} ${profile.lastName}.`);
  lines.push(`I was born on ${new Date(profile.dateOfBirth).toDateString()} and currently live in ${profile.city}, ${profile.country}.`);

  if (profile.hobbies) {
    lines.push(`My hobbies include ${profile.hobbies}.`);
  }
  
  if (profile.academicFieldOfStudy || profile.academicInstitution || profile.academicDegree) {
    let academicLine = 'Academically, I';

    if (profile.academicFieldOfStudy) academicLine += ` studied ${profile.academicFieldOfStudy}`;
    if (profile.academicInstitution) academicLine += ` at ${profile.academicInstitution}`;
    if (profile.academicGraduationYear) academicLine += ` and graduated in ${profile.academicGraduationYear}`;
    if (profile.academicDegree) academicLine += ` with a degree in ${profile.academicDegree}`;

    academicLine += '.';
    lines.push(academicLine);
  }

  const hasPro = profile.professionalJobTitle || profile.professionalCompanyName || profile.professionalYearsOfExperience || profile.professionalSkills;

  if (hasPro) {
    let proLine = 'Professionally, I';

    if (profile.professionalJobTitle) proLine += ` worked as ${profile.professionalJobTitle}`;
    if (profile.professionalCompanyName) proLine += ` at ${profile.professionalCompanyName}`;
    if (profile.professionalYearsOfExperience !== null && profile.professionalYearsOfExperience !== undefined)
      proLine += ` with ${profile.professionalYearsOfExperience} year${profile.professionalYearsOfExperience > 1 ? 's' : ''} of experience`;

    proLine += '.';
    lines.push(proLine);

    if (profile.professionalSkills) {
      lines.push(`My key skills include: ${profile.professionalSkills}.`);
    }
  }

  const hasStartup =
    profile.startupProjectName ||
    profile.startupMission ||
    profile.startupProblemStatement ||
    profile.startupSolution ||
    profile.startupImpact;

  if (hasStartup) {
    let startupLines: string[] = [];

    if (profile.startupProjectName) startupLines.push(`I worked on a startup project called "${profile.startupProjectName}".`);
    if (profile.startupMission) startupLines.push(`Its mission was: ${profile.startupMission}`);
    if (profile.startupProblemStatement) startupLines.push(`It addresses the problem: ${profile.startupProblemStatement}`);
    if (profile.startupSolution) startupLines.push(`The proposed solution was: ${profile.startupSolution}`);
    if (profile.startupImpact) startupLines.push(`Impact of the project: ${profile.startupImpact}`);

    lines.push(...startupLines);
  }

  return lines.join('\n');
}
