# Assessment Submission Email Template

**To:** [Recruiter / Hiring Manager / Reviewer Email]  
**Subject:** AWS Cloud & DevOps Intern Assignment Submission: Containerized Application Deployment — Rahul Mirji  

---

Hi [Hiring Manager / Team Name],

I have completed the technical assessment for the **AWS Cloud & DevOps Intern** assignment.

Below are the live endpoints, source repository, and architectural breakdown aligned with the assignment rubric:

### 🔗 Project Deliverables
- **Live Application URL:** [https://myapp-898877159294.asia-south1.run.app](https://myapp-898877159294.asia-south1.run.app)
- **Health Check Probe:** [https://myapp-898877159294.asia-south1.run.app/health](https://myapp-898877159294.asia-south1.run.app/health)
- **Runtime Metadata Probe:** [https://myapp-898877159294.asia-south1.run.app/api/info](https://myapp-898877159294.asia-south1.run.app/api/info)
- **GitHub Repository:** [https://github.com/RahulMirji/dockerized-app-cloudrun-deploy](https://github.com/RahulMirji/dockerized-app-cloudrun-deploy)

---

### 📋 Assignment Requirements Summary

1. **Docker (`Dockerfile` & `docker-compose.yml`)**:
   - `Dockerfile`: Hardened `node:22-alpine` image (~180MB) enforcing non-root `USER node` security, layer caching, and cross-compiled for `linux/amd64`.
   - `docker-compose.yml`: Multi-container local orchestration managing the Web microservice alongside a persistent **Redis** data cache on an isolated internal bridge network with health checks.

2. **Cloud Architecture & Service Selection**:
   - Implemented the full flow: `User → Domain → CDN (CloudFront / Edge) → Container Application (App Runner / Cloud Run) → Data Store`.
   - Documented detailed trade-off analysis comparing **AWS App Runner / Cloud Run vs EC2 vs ECS Fargate**, **ECR vs Docker Hub**, **CloudFront vs ALB direct**, and **RDS vs DynamoDB**.

3. **Domain, HTTPS & Networking**:
   - Documented DNS configuration (CNAME / Alias records in Route 53 / DuckDNS).
   - Automated HTTPS via edge TLS termination with managed SSL certificates.

4. **Production Security Measures**:
   - AWS Security Group equivalent inbound rules (restricting public traffic to 443/80 and isolating internal database ports).
   - Non-root container execution (`USER node`).
   - Zero hardcoded secrets; runtime configuration handled via environment variables.
   - Principle of least privilege enforced through dedicated service roles.

5. **Problems Faced & Learnings (4 Real Issues Solved)**:
   - Detailed troubleshooting of Apple Silicon `arm64` cross-compilation, cloud account billing quota resolution via CLI, serverless `$PORT` binding contracts, and resource display name length limits.

The repository includes a comprehensive `README.md` following the exact 7-section assignment rubric, an interview preparation guide (`INTERVIEW_PREP.md`), and automated scripts (`deploy.sh` and `teardown.sh`).

Looking forward to discussing the architecture and trade-offs during our interview!

Best regards,  
**Rahul Mirji**  
[Your Phone Number / LinkedIn Profile]
