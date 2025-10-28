package com.jobportal.jobportal.customexceptionhandler;

public class JobNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private final Long jobId;
    private final String title;

    public JobNotFoundException(Long jobId) {
        super("Job not found with id: " + jobId);
        this.jobId = jobId;
        this.title = null;
    }

    public JobNotFoundException(String title) {
        super("Job not found with title: " + title);
        this.title = title;
        this.jobId = null;
    }

    public Long getJobId() {
        return jobId;
    }

    public String getTitle() {
        return title;
    }
}


