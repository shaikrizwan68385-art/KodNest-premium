export interface CategorizedSkills {
    coreCS: string[];
    languages: string[];
    web: string[];
    data: string[];
    cloud: string[];
    testing: string[];
    other: string[];
}

export interface CompanyIntel {
    name: string;
    industry: string;
    sizeCategory: 'Startup (<200)' | 'Mid-size (200–2000)' | 'Enterprise (2000+)';
    hiringFocus: string;
}

export interface RoundMappingItem {
    roundTitle: string;
    focusAreas: string[];
    whyItMatters: string;
}

export interface ChecklistItem {
    roundTitle: string;
    items: string[];
}

export interface PlanDay {
    day: number;
    focus: string;
    tasks: string[];
}

export interface AnalysisEntry {
    id: string;
    createdAt: string;
    updatedAt: string;
    company: string;
    role: string;
    jdText: string;
    extractedSkills: CategorizedSkills;
    roundMapping: RoundMappingItem[];
    checklist: ChecklistItem[];
    plan7Days: PlanDay[];
    questions: string[];
    baseScore: number;
    finalScore: number;
    skillConfidenceMap: Record<string, 'know' | 'practice'>;
    companyIntel?: CompanyIntel;
}

const SKILL_MAP: Record<keyof Omit<CategorizedSkills, 'other'>, string[]> = {
    coreCS: ["DSA", "OOP", "DBMS", "OS", "Networks"],
    languages: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go"],
    web: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL"],
    data: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis"],
    cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"],
    testing: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest"]
};

const ENTERPRISE_COMPANIES = ["Google", "Amazon", "Microsoft", "TCS", "Infosys", "Wipro", "Accenture", "Meta", "Apple", "Oracle", "IBM"];

export function inferCompanyIntel(companyName: string): CompanyIntel {
    const name = companyName || "Unknown Company";
    const isEnterprise = ENTERPRISE_COMPANIES.some(c => name.toLowerCase().includes(c.toLowerCase()));

    return {
        name,
        industry: "Technology Services",
        sizeCategory: isEnterprise ? 'Enterprise (2000+)' : 'Startup (<200)',
        hiringFocus: isEnterprise
            ? "Structured DSA, core fundamentals, and scalable system design principles."
            : "Agility, deep ownership of the tech stack, and rapid problem-solving capabilities."
    };
}

export function extractSkills(jd: string): CategorizedSkills {
    const text = jd.toLowerCase();
    const result: CategorizedSkills = {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    };

    let totalFound = 0;
    for (const [category, skills] of Object.entries(SKILL_MAP)) {
        const found = skills.filter(skill => {
            const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'i');
            return regex.test(text);
        });
        if (found.length > 0) {
            (result as any)[category] = found;
            totalFound += found.length;
        }
    }

    if (totalFound === 0) {
        result.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    return result;
}

export function generateRoundMapping(companyName: string, skills: CategorizedSkills): RoundMappingItem[] {
    const intel = inferCompanyIntel(companyName);
    const isEnterprise = intel.sizeCategory === 'Enterprise (2000+)';
    const hasWeb = skills.web.length > 0;

    if (isEnterprise) {
        return [
            {
                roundTitle: "Round 1: Online Assessment",
                focusAreas: ["DSA", "Aptitude", "Core Fundamentals"],
                whyItMatters: "Filters candidates based on core logic and speed."
            },
            {
                roundTitle: "Round 2: Technical Interview I",
                focusAreas: ["DSA", "Complexity Analysis", "Core CS"],
                whyItMatters: "Verifies your coding proficiency and theoretical knowledge."
            },
            {
                roundTitle: "Round 3: Technical Interview II",
                focusAreas: ["System Design", "Projects", "Domain Depth"],
                whyItMatters: "Assesses your ability to apply knowledge to real-world scenarios."
            },
            {
                roundTitle: "Round 4: HR / Cultural Fit",
                focusAreas: ["Behavioral", "Culture", "Salary"],
                whyItMatters: "Ensures alignment with company values and long-term goals."
            }
        ];
    } else {
        return [
            {
                roundTitle: "Round 1: Practical Coding",
                focusAreas: hasWeb ? ["Feature Build", "Bug Fix"] : ["Problem Solving", "Logic"],
                whyItMatters: "Checks if you can actually 'ship' code in their specific stack."
            },
            {
                roundTitle: "Round 2: Technical Discussion",
                focusAreas: ["Architecture", "Decision Making", "Project Deep-dive"],
                whyItMatters: "Verifies technical depth and decision-making clarity."
            },
            {
                roundTitle: "Round 3: Cultural Fit & Founders",
                focusAreas: ["Ownership", "Pace", "Vision Alignment"],
                whyItMatters: "Critical for small teams to ensure you can handle the fast-paced environment."
            }
        ];
    }
}

export function generateChecklist(skills: CategorizedSkills): ChecklistItem[] {
    const hasWeb = skills.web.length > 0;
    const hasData = skills.data.length > 0;

    return [
        {
            roundTitle: "Round 1: Aptitude / Basics",
            items: [
                "Quantitative Aptitude (Time, Work, Profit/Loss)",
                "Logical Reasoning (Syllogisms, Puzzles)",
                "Verbal Ability (Comprehension, Grammar)",
                "Basic Debugging puzzles",
                "Company-specific mental math"
            ]
        },
        {
            roundTitle: "Round 2: DSA + Core CS",
            items: [
                "Mastering Arrays and Strings",
                "Complexity Analysis (Time & Space)",
                "Object Oriented Programming (Inheritance, Polymorphism)",
                "DBMS Fundamentals (ACID properties)",
                "Operating System basics (Threading, Deadlock)",
                "Mock DSA problem solving on Leetcode"
            ]
        },
        {
            roundTitle: "Round 3: Tech interview (projects + stack)",
            items: [
                "Deep dive into final year project",
                ...(hasWeb ? ["Frontend/Backend architecture walkthrough", "State management patterns"] : []),
                ...(hasData ? ["Database schema design walkthrough", "SQL query optimization"] : []),
                "Resume walkthrough (Experience & Skills)",
                "Explain tech-stack choices made in projects",
                "Code walkthrough of personal Git repos"
            ]
        },
        {
            roundTitle: "Round 4: Managerial / HR",
            items: [
                "Why this company? (Research values & culture)",
                "Where do you see yourself in 5 years?",
                "Handling conflict in teams (STAR method)",
                "Strengths and Weaknesses with examples",
                "Question to ask the interviewer",
                "Salary/Relocation expectations"
            ]
        }
    ];
}

export function generatePlan(skills: CategorizedSkills): PlanDay[] {
    const hasReact = skills.web.includes("React");
    const hasJava = skills.languages.includes("Java");

    return [
        { day: 1, focus: "Basics & Core CS", tasks: ["OOP fundamentals", "DBMS ACID properties", "OS Process management"] },
        { day: 2, focus: "Data Structures", tasks: ["Array manipulation", "String algorithms", "Linked List basics"] },
        { day: 3, focus: "Algorithms practice", tasks: ["Focus on Sorting & Searching", `Solve 5 problems${hasJava ? " in Java" : ""}`] },
        { day: 4, focus: "Complex Topics", tasks: ["Tree traversals", "Dynamic Programming basics", "Graph representation"] },
        { day: 5, focus: "Project Alignment", tasks: ["Map projects to JD requirements", "Review project architecture", "Prepare project elevator pitch"] },
        { day: 6, focus: "Mock & Strategy", tasks: ["Behavioral questions (STAR)", `Mock interview${hasReact ? " (React focus)" : ""}`] },
        { day: 7, focus: "Final Revision", tasks: ["Quick glance at cheat sheets", "Company research", "Confidence building"] }
    ];
}

export function generateQuestions(skills: CategorizedSkills): string[] {
    const questions: string[] = [];
    const allSkills = Object.values(skills).flat().join(" ").toLowerCase();

    if (allSkills.includes("sql")) questions.push("Explain indexing and when it helps.");
    if (allSkills.includes("react")) questions.push("Explain state management options and when to use Context vs Redux.");
    if (allSkills.includes("dsa")) questions.push("How would you optimize search in sorted data?");
    if (allSkills.includes("java")) questions.push("Explain the difference between HashMap and ConcurrentHashMap.");
    if (allSkills.includes("node.js")) questions.push("How does the event loop work in Node.js?");
    if (allSkills.includes("docker")) questions.push("What is the difference between a container and an image?");
    if (allSkills.includes("aws")) questions.push("Explain S3 storage classes and their use cases.");

    const generic = [
        "Tell me about a challenging bug you fixed.",
        "How do you handle tight deadlines?",
        "Explain your project architecture at a high level.",
        "What is your approach to unit testing?",
        "Explain the SOLID principles with examples."
    ];

    while (questions.length < 10 && generic.length > 0) {
        questions.push(generic.shift()!);
    }

    return questions.slice(0, 10);
}

export function calculateReadinessScore(company: string, role: string, jd: string, extractedCount: number): number {
    let score = 35;
    score += Math.min(extractedCount * 5, 30);
    if (company.trim()) score += 10;
    if (role.trim()) score += 10;
    if (jd.length > 800) score += 10;
    return Math.min(score, 100);
}
