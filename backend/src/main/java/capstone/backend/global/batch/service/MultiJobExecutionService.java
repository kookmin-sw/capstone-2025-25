package capstone.backend.global.batch.service;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MultiJobExecutionService {
    private final JobLauncher jobLauncher;
    private final Map<String, Job> jobMap;

    public void execute(String jobName){
        try{
            Job job = jobMap.get(jobName);
            if(job == null){
                log.warn("Job {} not found", jobName);
                return;
            }

            JobParameters jobParameters = new JobParametersBuilder()
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();

            JobExecution jobExecution = jobLauncher.run(job, jobParameters);
            log.info("Job {} started with status: {}", jobName, jobExecution.getStatus());

        } catch (Exception e){
            log.error("Job {} failed", jobName, e);
        }
    }
}
