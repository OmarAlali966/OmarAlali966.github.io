/* ============================================================
   PROJECTS DATA
   ------------------------------------------------------------
   HOW TO ADD A NEW PROJECT:
   1. Copy an object from FEATURED_PROJECTS or FUTURE_PROJECTS.
   2. Fill in the fields — the Projects and Security Lab pages
      render automatically from this file.
   ============================================================ */

const FEATURED_PROJECTS = [
  {
        id: "aws-enterprise-security-monitoring-platform",
        name: "AWS Enterprise Security Monitoring Platform",
        tagline: "An enterprise-style AWS security monitoring platform built with Terraform.",
        status: "In Progress",
        overview: "A hands-on, enterprise-style security monitoring platform built entirely with Terraform on AWS. The project simulates how a real organization would establish identity controls, an immutable audit trail, automated threat detection, and real-time alerting \u2014 then layers incident response playbooks on top so findings turn into action.",
        architecture: "The platform is built in stages on top of a least-privilege identity foundation (IAM groups, roles, and password policy). CloudTrail writes an encrypted, tamper-evident audit trail (via KMS) of every API call. GuardDuty, Security Hub, and AWS Config provide continuous threat detection and compliance monitoring, with GuardDuty and Config findings flowing into Security Hub as a single pane of glass. CloudWatch Logs, metric filters, and alarms watch for high-risk patterns \u2014 root account usage, failed logins, security-group and IAM changes, logging tampering, and unauthorized API calls \u2014 and push real-time notifications through SNS. Every design decision follows defense-in-depth and least-privilege principles, with cost trade-offs documented throughout.",
        technologies: ["Terraform", "AWS IAM", "CloudTrail", "GuardDuty", "Security Hub", "AWS Config", "CloudWatch", "SNS", "KMS"],
        highlights: ["Secure, encrypted logging", "Continuous cloud monitoring", "Automated incident response workflows", "Cloud security best practices baked into every stage"],
        screenshots: [
          { id: "shot-1", caption: "GuardDuty findings dashboard", isPlaceholder: true },
          { id: "shot-2", caption: "Security Hub compliance overview", isPlaceholder: true },
          { id: "shot-3", caption: "CloudWatch alarms & SNS alerting", isPlaceholder: true },
          { id: "shot-4", caption: "CloudTrail encrypted log storage", isPlaceholder: true }
              ],
        lessonsLearned: [
                "Designing least-privilege IAM policies from the start makes every later security control easier to reason about.",
                "Centralizing GuardDuty and Config findings in Security Hub removes the need to check multiple dashboards during triage.",
                "Pairing detection with real-time SNS alerting turns 'a finding exists somewhere' into 'a human is notified within minutes.'",
                "Documenting cost trade-offs alongside architecture decisions is just as important as the security design itself."
              ],
        githubUrl: "https://github.com/OmarAlali966/aws-enterprise-security-monitoring-platform",
        documentationUrl: "https://github.com/OmarAlali966/aws-enterprise-security-monitoring-platform/tree/main/docs"
  }
  ];

const FUTURE_PROJECTS = [
  {
        id: "sentinel-soc-lab",
        name: "Microsoft Sentinel SOC Lab",
        tagline: "A simulated SOC environment built around Microsoft Sentinel.",
        status: "Planned",
        summary: "A future lab focused on Sentinel analytics rules, workbooks, and end-to-end alert triage in a simulated SOC environment."
  },
  {
        id: "azure-security-lab",
        name: "Azure Security Lab",
        tagline: "Applying cloud security fundamentals within Microsoft Azure.",
        status: "Planned",
        summary: "A future lab exploring Azure identity, network security, and Defender for Cloud, mirroring the AWS platform's approach."
  },
  {
        id: "threat-hunting-lab",
        name: "Threat Hunting Lab",
        tagline: "Proactive, hypothesis-driven threat hunting exercises.",
        status: "Planned",
        summary: "A future lab practicing hypothesis-driven threat hunting using KQL and MITRE ATT&CK-mapped scenarios."
  },
  {
        id: "detection-engineering-lab",
        name: "Detection Engineering Lab",
        tagline: "Building and tuning custom detection rules.",
        status: "Planned",
        summary: "A future lab focused on writing, testing, and tuning custom detection content to reduce false positives."
  },
  {
        id: "active-directory-lab",
        name: "Active Directory Lab",
        tagline: "Hardening and attacking a simulated AD environment.",
        status: "Planned",
        summary: "A future lab covering AD hardening, common attack paths, and detection strategies in a controlled lab environment."
  },
  {
        id: "cloud-incident-response-lab",
        name: "Cloud Incident Response Lab",
        tagline: "End-to-end incident response in a cloud environment.",
        status: "Planned",
        summary: "A future lab simulating a full incident response lifecycle in the cloud, from detection through containment and lessons learned."
  }
  ];
