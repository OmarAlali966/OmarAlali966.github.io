/* ============================================================
   SKILLS DATA
   ------------------------------------------------------------
   HOW TO ADD A NEW SKILL OR CATEGORY:
   1. To add a skill, add a string to the "items" array.
   2. To add a category, copy a { ... } block and give it a
      unique "id", "title", and "icon" key.
   ============================================================ */

const SKILLS = [
  {
        id: "cloud",
        title: "Cloud",
        icon: "cloud",
        items: ["AWS", "Terraform", "CloudTrail", "GuardDuty", "Security Hub", "AWS Config", "CloudWatch", "IAM"]
  },
  {
        id: "security",
        title: "Security",
        icon: "shield",
        items: ["Microsoft Sentinel", "Splunk", "Threat Hunting", "Incident Response", "SIEM", "MITRE ATT&CK", "KQL"]
  },
  {
        id: "programming",
        title: "Programming",
        icon: "code",
        items: ["Python", "PowerShell", "Bash"]
  },
  {
        id: "os",
        title: "Operating Systems",
        icon: "terminal",
        items: ["Windows", "Linux"]
  },
  {
        id: "networking",
        title: "Networking",
        icon: "network",
        items: ["TCP/IP", "DNS", "HTTP", "VPN", "Firewalls"]
  }
  ];
