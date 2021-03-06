package com.orchestranetworks.geomatch.match;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Geomatch {
	static Geomatch Match = null;
	private HashMap<Object, Coordinate> coords = new HashMap<>();
	private Coordinate origin = null;
	private Double dis = Double.MAX_VALUE;

	public static void main(String[] args) {
		/*Match = new Geomatch();
		Match.forceAdd(new Coordinate(151, 10001));
		Match.forceAdd(new Coordinate(51, 50));
		Match.forceAdd(new Coordinate(50, 50));
		Match.forceAdd(new Coordinate(50, 49));
		Match.refineCordinates(2 * Match.getAverageDistance());
		Match.calculateOrigin();
		System.out
				.println(Match.getOrigin() + ":" + Match.getAverageDistance());
		System.out.println("MATCH? " + Match.isMatch(Match.getOrigin(), 0d));
		System.out.println("MATCH? "
				+ Match.isMatch(new Coordinate(100, 100), 2d));*/
	}

	public boolean isMatch(Coordinate c, Double minDis) {
		return getDistance(c, origin) <= minDis;
	}
	
	//list of coords that are to be set to false
	public List<Coordinate> getOutliers() {
		return getOutliers(Math.max(dis * 1.5, 0.001));
	}
	
	// only add if it's a match, returns if it was added.
	public boolean addIfMatch(Object id, Coordinate c, Double minDis) {
		if (c.isValid() || isMatch(c, minDis)) {
			forceAdd(id, c);
			return true;
		}
		return false;
	}

	public void calculateOrigin() {
		if (coords.size() > 2) {
			Coordinate tempOrigin;
			for (int i = 0; i < coords.size(); i++) {
				tempOrigin = coords.get(i);
				Double distance = getDistanceToAllOtherPoints(tempOrigin);
				if (distance < getAverageDistance()) {
					setAverageDistance(distance);
					origin = tempOrigin;
				}
			}
		}
	}

	// add without checking.
	public void forceAdd(Object id, Coordinate Coordinate) {
		coords.put(id, Coordinate);
		calculateOrigin();
	}

	// search through your coordinates and collect those that are further than
	// minDistance

	public List<Coordinate> getOutliers(Double minDistance) {
		List<Coordinate> outliers = new ArrayList<Coordinate>();
		for (Coordinate c : coords)
			if (c.isValid() || getDistance(origin, c) > minDistance)
				outliers.add(c);
		return outliers;
	}

	// used to trim outliers that were once not outliers
	private void refineCordinates(Double minDistance) {
		coords.remove(getOutliers(minDistance));
		calculateOrigin();// grab new origin, if any, and recalcuate distance.
	}

	private Double getDistanceToAllOtherPoints(Coordinate a) {
		Double distance = 0.0;
		for (Coordinate c : coords)
			if (a != c)
				distance += getDistance(a, c);
		distance /= coords.size() - 1;
		return distance;
	}

	private Double getDistance(Coordinate a, Coordinate b) {
		return Math.sqrt(Math.pow(a.getLatitude().doubleValue()
				- b.getLatitude().doubleValue(), 2)
				+ Math.pow(a.getLongitude().doubleValue()
						- b.getLongitude().doubleValue(), 2));
	}

	public Coordinate getOrigin() {
		return origin;
	}

	public Double getAverageDistance() {
		return dis;
	}

	public void setAverageDistance(Double dis) {
		this.dis = dis;
	}

}