export const getProjectDetails = () => [
    "> INITIATING PROJECT SCAN...",
    "> DETECTED: VULNERABILITY_SCANNER_V2",
    "> STATUS: DEPLOYED",
    "> STACK: PYTHON, RUST, DOCKER",
    "> DESCRIPTION: Automated penetration testing suite",
    "> capable of identifying OWASP Top 10 vulnerabilities.",
    "> ",
    "> DETECTED: ZERO_DAY_TRACKER",
    "> STATUS: ACTIVE",
    "> STACK: REACT, NODE.JS, MONGODB",
    "> DESCRIPTION: Real-time dashboard for monitoring",
    "> emerging security threats and CVEs.",
    "> ",
    "> [SCAN COMPLETE]"
]

export const getExperienceDetails = () => [
    "> ACCESSING PERSONNEL FILE...",
    "> ROLE: SECURITY ANALYST",
    "> CLEARANCE: LEVEL 4",
    "> ",
    "> CURRENT ASSIGNMENT:",
    "> Conducting comprehensive security audits for",
    "> fintech startups and enterprise clients.",
    "> ",
    "> PREVIOUS OPERATIONS:",
    "> - Bug Bounty Hunter (HackerOne, Bugcrowd)",
    "> - Network Security Engineer (Contract)",
    "> ",
    "> SKILLS:",
    "> Penetration Testing, Cryptography, Cloud Security,",
    "> Incident Response, Python Scripting.",
    "> [END OF FILE]"
]

export const getContactDetails = () => [
    "> ESTABLISHING SECURE CONNECTION...",
    "> ENCRYPTION: AES-256",
    "> ",
    "> AVAILABLE CHANNELS:",
    "> [EMAIL]: chris.kuriakose@example.com",
    "> [LINKEDIN]: /in/chriskuriakose",
    "> [GITHUB]: @chriskuriakose",
    "> ",
    "> TRANSMISSION STATUS: WAITING FOR INPUT...",
    "> ",
    "> Send a message to initiate collaboration.",
    "> Response time: < 24 hours.",
    "> [CONNECTION ACTIVE]"
]

export const content: Record<string, string> = {
    PROJECTS: getProjectDetails().join('\n'),
    EXPERIENCE: getExperienceDetails().join('\n'),
    CONTACT: getContactDetails().join('\n')
}
