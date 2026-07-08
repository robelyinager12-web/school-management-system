import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserRound,
  Calendar,
  ClipboardList,
  BookOpen,
  Bus,
  Building2,
  Wallet,
  Briefcase,
  Package,
  Bell,
  BarChart3,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Students", href: "/students", icon: GraduationCap },
  { label: "Teachers", href: "/teachers", icon: Users },
  { label: "Parents", href: "/parents", icon: UserRound },
  { label: "Attendance", href: "/attendance", icon: ClipboardList },
  { label: "Examinations", href: "/examinations", icon: Calendar },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Transport", href: "/transport", icon: Bus },
  { label: "Hostel", href: "/hostel", icon: Building2 },
  { label: "Finance", href: "/finance", icon: Wallet },
  { label: "HR", href: "/hr", icon: Briefcase },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "AI Center", href: "/ai-center", icon: Sparkles },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];