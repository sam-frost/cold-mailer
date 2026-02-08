const subjectTemplate = ({ company }) =>
  `Interest in Software Engineer Opportunities at ${company}`;

const bodyTemplate = ({ recipientName, position, company }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Job Interest</title>
  </head>
  <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #000;">
    
    <p>Hi ${recipientName},</p>

    <p>
      I am very keen to contribute at ${company} for the
      <strong>${position}</strong> role.
    </p>

    <p>
      With <strong>2+ years of experience</strong> in fast-paced startup environments,
      I have taken ownership of backend systems, shipping features end-to-end while
      ensuring scalability, resilience, and maintainability.
    </p>

    <p>
      I am well-versed in
      <strong>
        Java 8+, Spring Boot, Kafka, Redis, Docker, Kubernetes, CI/CD,
        event-driven systems, and distributed systems
      </strong>.
      I also have strong knowledge of <strong>LLD and HLD architecture</strong>,
      with active contributions to my current team.
    </p>

    <p>
      Additionally, I have solved <strong>350+ DSA problems</strong>, demonstrating
      strong problem-solving skills.
    </p>

    <p>
      Even if there are no current openings, I would love to connect, learn more
      about your engineering team, and explore how I could contribute in the future.
    </p>

    <p>Looking forward to hearing from you!</p>

    <p>
      Best regards,<br />
      <strong>Samarth Negi</strong><br />
      <a href="mailto:samarthnegi2002@gmail.com">samarthnegi2002@gmail.com</a><br />
      +91 9717433825
    </p>

    <p>
      <a href="https://www.linkedin.com/in/samarth-negi-3250451b6/">LinkedIn</a> |
      <a href="https://github.com/Sam-Frost">GitHub</a> |
      <a href="https://drive.google.com/file/d/1EfGXZtbwemm4ZGGBcLPT32ZEZrw7S3-V/view?usp=sharing">Resume</a>
    </p>

  </body>
</html>
`;

module.exports = { subjectTemplate, bodyTemplate };
