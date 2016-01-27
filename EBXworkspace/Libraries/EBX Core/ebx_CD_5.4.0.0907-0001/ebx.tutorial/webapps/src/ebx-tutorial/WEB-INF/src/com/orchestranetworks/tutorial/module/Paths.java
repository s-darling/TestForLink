package com.orchestranetworks.tutorial.module;

import com.orchestranetworks.schema.Path;
/**
 * Generated by EBX5 5.2.2 [0827-addon002] beta-july-addon, at  2012/07/03 18:47:08 [CEST].
 * WARNING: Any manual changes to this class may be overwritten by generation process.
 * DO NOT MODIFY THIS CLASS.
 * 
 * This interface defines constants related to schema [Module: ebx-tutorial, path: /WEB-INF/ebx/schema/ebx-tutorial.xsd].
 * 
 * Root paths in this interface: 
 * 	'/root'   relativeToRoot: false
 * 
 */
public interface Paths
{
	// ===============================================
	// Constants for nodes under '/root'.
	// Prefix:  ''.
	// Statistics:
	//		59 path constants.
	//		22 leaf nodes.
	public static Path _Root = Path.parse("/root");

	// Table type path
	public class _Titles {
		private static Path _Titles = _Root.add("Titles");
		public static Path getPathInSchema()
		{
			return _Titles;
		}
	public static Path _Title_id = Path.parse("./title_id");
	public static Path _Title = Path.parse("./title");
	public static Path _Type = Path.parse("./type");
	public static Path _Pub_id = Path.parse("./pub_id");
	public static Path _Au_id = Path.parse("./au_id");
	public static Path _Unit_price = Path.parse("./unit_price");
	public static Path _Total_sales = Path.parse("./total_sales");
	public static Path _Front_picture = Path.parse("./front_picture");
	} 

	// Table type path
	public class _Publishers {
		private static Path _Publishers = _Root.add("Publishers");
		public static Path getPathInSchema()
		{
			return _Publishers;
		}
	public static Path _Pub_id = Path.parse("./pub_id");
	public static Path _Name = Path.parse("./name");
	public static Path _City = Path.parse("./city");
	} 

	// Table type path
	public class _Authors {
		private static Path _Authors = _Root.add("Authors");
		public static Path getPathInSchema()
		{
			return _Authors;
		}
	public static Path _Au_id = Path.parse("./au_id");
	public static Path _Lastname = Path.parse("./lastname");
	public static Path _Firstname = Path.parse("./firstname");
	public static Path _Address = Path.parse("./address");
	public static Path _City = Path.parse("./city");
	public static Path _Country = Path.parse("./country");
	public static Path _LinkToAuthorTitles = Path.parse("./linkToAuthorTitles");
	} 

	// Table type path
	public class _Royalties {
		private static Path _Royalties = _Root.add("Royalties");
		public static Path getPathInSchema()
		{
			return _Royalties;
		}
	public static Path _Title_id = Path.parse("./title_id");
	public static Path _Lo_range = Path.parse("./lo_range");
	public static Path _Hi_range = Path.parse("./hi_range");
	public static Path _Royalty = Path.parse("./royalty");
	} 
	// ===============================================

}
