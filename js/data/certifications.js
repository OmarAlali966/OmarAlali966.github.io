/* ============================================================
   CERTIFICATIONS DATA
   ------------------------------------------------------------
   HOW TO ADD A NEW CERTIFICATION:
   1. Copy one object below (the { ... } block).
   2. Paste it into the CERTIFICATIONS array.
   3. Update the fields. That's it \u2014 no layout/HTML changes needed.

   status: "completed" | "in-progress" | "planned"
   ============================================================ */

const CERTIFICATIONS = [
   {
          id: "security-plus",
          name: "CompTIA Security+",
          issuer: "CompTIA",
          logo: "S+",
          accent: "blue",
          status: "completed",
          issueDate: "July 2026",
          expirationDate: "July 2029",
          credentialId: "COMP001023075519",
          verifyUrl: "https://cp.certmetrics.com/comptia/en/public/verify/credential/3f6498f9a966470e94f51dfc9090eaa7",
          officialUrl: "https://www.comptia.org/certifications/security",
          isPlaceholderDetails: false,
          skills: ["Threat Management", "Cryptography", "Identity Management", "Risk Mitigation", "Network Security"],
          whatLearned: ["Core security principles across risk, cryptography, and identity", "How to assess and mitigate common threats and vulnerabilities", "Foundational network and operational security controls"],
   },
   {
          id: "cysa-plus",
          name: "CompTIA CySA+",
          issuer: "CompTIA",
          logo: "CySA+",
          accent: "cyan",
          status: "completed",
          issueDate: "July 2026",
          expirationDate: "July 2029",
          credentialId: "COMP001023075519",
          verifyUrl: "https://cp.certmetrics.com/comptia/en/public/verify/credential/1fc778b4e0a444e89d0121cb8551f124",
          officialUrl: "https://www.comptia.org/certifications/cybersecurity-analyst",
          isPlaceholderDetails: false,
          skills: ["Threat Detection", "Security Analytics", "Incident Response", "Vulnerability Management", "SOC Operations"],
          whatLearned: ["Behavioral analytics to detect and respond to threats", "Vulnerability management lifecycle", "SOC-style incident response workflows"],
          howApplied: "Add a short note on how you've used this in labs or projects.",
          notes: "Add any personal notes about this certification."
   },
   {
          id: "sc-200",
          name: "Microsoft Certified: Security Operations Analyst Associate",
          shortName: "SC-200",
          issuer: "Microsoft",
          logo: "SC-200",
          accent: "indigo",
          status: "completed",
          issueDate: "July 2026",
          expirationDate: "July 2029",
          credentialId: "9B56CB12D1514ED3",
          verifyUrl: "https://learn.microsoft.com/en-us/users/omaralali-6964/credentials/9b56cb12d1514ed3?ref=https%3A%2F%2Fwww.linkedin.com%2F",
          officialUrl: "https://learn.microsoft.com/credentials/certifications/security-operations-analyst/",
          isPlaceholderDetails: false,
          skills: ["Microsoft Sentinel", "Microsoft Defender", "KQL", "Threat Hunting", "SOC Analysis"],
          whatLearned: ["Configuring and using Microsoft Sentinel for detection", "Writing KQL queries to hunt for threats", "Investigating and remediating incidents with Microsoft Defender"],
          howApplied: "Add a short note on how you've used this in labs or projects.",
          notes: "Add any personal notes about this certification."
   },
   {
          id: "aws-saa",
          name: "AWS Certified Solutions Architect \u2013 Associate",
          shortName: "AWS SAA-C03",
          issuer: "Amazon Web Services",
          logo: "AWS",
          accent: "orange",
          status: "completed",
          issueDate: "July 2026",
          expirationDate: "July 2029",
          credentialId: "36ce6ae9e58840fe8ebc956072424472",
          verifyUrl: "https://cp.certmetrics.com/amazon/en/public/verify/credential/36ce6ae9e58840fe8ebc956072424472",
          officialUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
          isPlaceholderDetails: true,
          skills: ["AWS Architecture", "IAM", "VPC Networking", "Cost Optimization", "High Availability"],
          whatLearned: ["Designing resilient, cost-aware architectures on AWS", "IAM and VPC networking fundamentals", "Choosing the right AWS service for a given workload"],
          howApplied: "Directly applied in the AWS Enterprise Security Monitoring Platform project's IAM and networking design.",
          notes: "Add any personal notes about this certification."
   },
   {
          id: "aws-security-specialty",
          name: "AWS Certified Security \u2013 Specialty",
          shortName: "AWS Security Specialty",
          issuer: "Amazon Web Services",
          logo: "AWS",
          accent: "orange",
          status: "in-progress",
          issueDate: "In progress",
          expirationDate: "N/A",
          credentialId: "Not yet issued",
          verifyUrl: "#",
          officialUrl: "https://aws.amazon.com/certification/certified-security-specialty/",
          isPlaceholderDetails: true,
          skills: ["GuardDuty", "Security Hub", "KMS", "IAM Policy Design", "Incident Response on AWS"],
          whatLearned: ["Deep-diving into AWS-native detection and response services", "Advanced KMS and encryption strategies", "Incident response patterns specific to AWS"],
          howApplied: "Studying alongside hands-on work in the AWS Enterprise Security Monitoring Platform project.",
          notes: "Add any personal notes about this certification."
   },
   {
          id: "ccsk",
          name: "Certificate of Cloud Security Knowledge (CCSK)",
          shortName: "CCSK",
          issuer: "Cloud Security Alliance",
          logo: "CCSK",
          accent: "teal",
          status: "planned",
          issueDate: "Planned",
          expirationDate: "N/A",
          credentialId: "Not yet issued",
          verifyUrl: "#",
          officialUrl: "https://cloudsecurityalliance.org/education/ccsk/",
          isPlaceholderDetails: true,
          skills: ["Cloud Governance", "Cloud Risk Management", "Shared Responsibility Model", "Cloud Architecture Security"],
          whatLearned: ["To be updated once studying begins."],
          howApplied: "Add a short note on how you've used this in labs or projects.",
          notes: "Add any personal notes about this certification."
   }
   ];
