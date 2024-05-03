
interface MenuItem {
    name: string;
    icon?: string;
    items?: MenuSubItem[];
}

interface MenuSubItem {
    name: string;
    page: string;
}

export const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      icon: "fa-house",
      items: [
        { name: "Overview", page: "admin/dashboard" },
      ]
    },
    {
      name: "Cources",
      icon: "fa-tag",
      items: [
        { name: "Individual Software", page: "admin/course/individualCourse" },
        { name: "Package", page: "admin/course/package" }
      ]
    },
    {
      name: "Students",
      icon: "fa-user",
      items: [
        { name: "Student Details", page: "customer-group" },
        { name: "Students got placed", page: "reviews" }
      ]
    },
     {
      name: "CMS",
      icon: "fa-users-viewfinder",
      items: [
	    	{ name: "Hero", page: "hero" },
      ]
    },
    {
      name: "Settings",
      icon: "fa-gear",
      items: [
        { name: "General Settings", page: "settings-general" },
        { name: "Tax Configuration", page: "settings-tax" },
        { name: "Admin Users", page: "settings-admin-users" },
      ]
    },
  ];