/* ============================================================
   JOURNEY / TIMELINE DATA
   ------------------------------------------------------------
   HOW TO ADD A NEW MILESTONE:
   1. Copy one object below.
   2. Add it to the TIMELINE array in the order it happened.
   3. Set "type" to control the icon + color:
      "education" | "cert" | "project" | "future"
   ============================================================ */

const TIMELINE = [
  {
        id: "learn-english",
        type: "education",
        date: "August 2021",
        title: "Learned English at OHLA School (Miami)",
        description: "Studied English at OHLA School in Miami, building the language foundation for pursuing higher education and a cybersecurity career in the United States.",
        isPlaceholderDate: false
  },
  {
        id: "start-cyber",
        type: "education",
        date: "August 2022",
        title: "Started Studying Cybersecurity",
        description: "Began the Cybersecurity program at Florida International University (FIU), building a foundation in networking, systems, and security fundamentals.",
        isPlaceholderDate: false
  },
  {
        id: "security-plus",
        type: "cert",
        date: "July 2026",
        title: "CompTIA Security+",
        description: "Earned CompTIA Security+, validating core security principles: risk management, cryptography, identity, and network security.",
        isPlaceholderDate: false
  },
  {
        id: "cysa-plus",
        type: "cert",
        date: "July 2026",
        title: "CompTIA CySA+",
        description: "Earned CompTIA CySA+, focused on threat detection, security analytics, and incident response from a SOC analyst perspective.",
        isPlaceholderDate: false
  },
  {
        id: "sc-200",
        type: "cert",
        date: "July 2026",
        title: "Microsoft SC-200",
        description: "Earned the Microsoft Certified: Security Operations Analyst Associate certification, covering Microsoft Sentinel, Defender, and KQL-based threat hunting.",
        isPlaceholderDate: false
  },
  {
        id: "aws-saa",
        type: "cert",
        date: "July 2026",
        title: "AWS Solutions Architect \u2013 Associate",
        description: "Earned AWS Certified Solutions Architect \u2013 Associate, developing a strong foundation in AWS architecture, IAM, networking, and cost-aware design.",
        isPlaceholderDate: false
  },
  {
        id: "aws-security-project",
        type: "project",
        date: "In Progress",
        title: "AWS Enterprise Security Monitoring Platform",
        description: "Building a hands-on enterprise-style AWS security monitoring platform using Terraform \u2014 IAM, CloudTrail, GuardDuty, Security Hub, AWS Config, CloudWatch, and SNS.",
        isPlaceholderDate: false
  },
  {
        id: "aws-security-specialty",
        type: "cert",
        date: "In Progress",
        title: "AWS Security \u2013 Specialty (In Progress)",
        description: "Currently studying for AWS Certified Security \u2013 Specialty to deepen expertise in cloud-native detection, encryption, and incident response.",
        isPlaceholderDate: false
  },
  {
        id: "ccsk",
        type: "cert",
        date: "In Progress",
        title: "CCSK (In Progress)",
        description: "Planning to pursue the Certificate of Cloud Security Knowledge (CCSK) to strengthen vendor-neutral cloud security governance knowledge.",
        isPlaceholderDate: false
  },
  {
        id: "gcih",
        type: "cert",
        date: "In Progress",
        title: "GIAC Certified Incident Handler (GCIH)",
        description: "Studying for GIAC Certified Incident Handler (GCIH), focused on detecting, responding to, and handling security incidents and attacker techniques.",
        isPlaceholderDate: false
  },
  {
        id: "gsoc",
        type: "cert",
        date: "In Progress",
        title: "GIAC Security Operations Certified (GSOC)",
        description: "Pursuing GIAC Security Operations Certified (GSOC) to strengthen SOC operations, detection engineering, and continuous security monitoring skills.",
        isPlaceholderDate: false
  },
  {
        id: "gcti",
        type: "cert",
        date: "In Progress",
        title: "GIAC Cyber Threat Intelligence (GCTI)",
        description: "Working toward GIAC Cyber Threat Intelligence (GCTI), covering threat intelligence analysis, adversary tracking, and intelligence-driven defense.",
        isPlaceholderDate: false
  },
  {
        id: "gdat",
        type: "cert",
        date: "In Progress",
        title: "GIAC Defending Advanced Threats (GDAT)",
        description: "Studying for GIAC Defending Advanced Threats (GDAT), focused on defending against advanced and persistent adversaries across the kill chain.",
        isPlaceholderDate: false
  },
  {
        id: "ecthpv2",
        type: "cert",
        date: "In Progress",
        title: "eLearnSecurity Certified Threat Hunting Professional v2 (eCTHPv2)",
        description: "Pursuing eLearnSecurity Certified Threat Hunting Professional v2 (eCTHPv2) to build proactive threat hunting and detection skills across endpoints and networks.",
        isPlaceholderDate: false
  },
  {
        id: "ecdfp",
        type: "cert",
        date: "In Progress",
        title: "eLearnSecurity Certified Digital Forensics Professional (eCDFP)",
        description: "Working toward eLearnSecurity Certified Digital Forensics Professional (eCDFP), covering digital forensics, evidence acquisition, and incident investigation.",
        isPlaceholderDate: false
  },
  {
        id: "ceh",
        type: "cert",
        date: "In Progress",
        title: "Certified Ethical Hacker (CEH)",
        description: "Studying for EC-Council Certified Ethical Hacker (CEH), covering offensive security fundamentals, enumeration, and ethical penetration testing techniques.",
        isPlaceholderDate: false
  },
  {
        id: "osda",
        type: "cert",
        date: "In Progress",
        title: "OffSec Defense Analyst (OSDA / SOC-200)",
        description: "Pursuing OffSec Defense Analyst (OSDA / SOC-200) to develop hands-on detection engineering and blue-team analysis skills against real-world attacks.",
        isPlaceholderDate: false
  }
  ];
