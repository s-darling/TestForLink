package com.orchestranetworks.geomatch.match;

public class GoogleResponse {
	/**
	 * 
	 * 
	 * @author Abhishek Somani
	 * 
	 */

	private Result[] results;
	private String status;

	public Result[] getResults() {
		return results;
	}

	public void setResults(Result[] results) {
		this.results = results;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
