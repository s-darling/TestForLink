package com.orchestranetworks.geomatch.match;

import java.math.BigDecimal;
import java.math.MathContext;

public class Coordinate {

	private Double lat;
	private Double lng;
	private boolean valid = false;

	public Coordinate(Integer lat, Integer lng) {
		this.lat = Double.valueOf(lat);
		this.lng = Double.valueOf(lng);
	}

	public Coordinate(BigDecimal lat, BigDecimal lng, Boolean validity) {
		setValid(validity);
		this.setLatitude(lat);
		this.setLongitude(lng);
	}

	public Coordinate(Double lat, Double lng) {
		this.lat = lat;
		this.lng = lng;
	}

	public Coordinate(BigDecimal lat, BigDecimal lng) {
		this.setLatitude(lat);
		this.setLongitude(lng);
	}

	private MathContext mc = new MathContext(14);

	public BigDecimal getLongitude() {
		return BigDecimal.valueOf(lng).round(mc);
	}

	public BigDecimal getLatitude() {
		return BigDecimal.valueOf(lat).round(mc);
	}

	public void setLongitude(BigDecimal y) {
		this.lng = y.doubleValue();
	}

	@Override
	public String toString() {
		return new StringBuilder("[x:").append(lat).append(", y:").append(lng)
				.append("]").toString();
	}

	public void setLatitude(BigDecimal x) {
		this.lat = x.doubleValue();
	}

	public boolean isValid() {
		return valid;
	}

	public void setValid(boolean valid) {
		this.valid = valid;
	}

}