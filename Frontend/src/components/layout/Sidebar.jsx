import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../../utils/cn";
import { navigationData } from "../../data/mockData";
import { BrandMark } from "../brand/BrandMark";
import { useAuth } from "../../context/AuthContext";

function NavEntry({ item, collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const childActive = item.children?.some((child) => location.pathname === child.href || location.pathname.startsWith(`${child.href}/`));
  const [open, setOpen] = useState(Boolean(childActive));

  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);

  if (!item.children?.length) {
    return (
      <li>
        <NavLink
          to={item.href}
          end={item.href === "/dashboard"}
          className={({ isActive }) =>
            cn(
              "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-emerald-400 text-emerald-950"
                : "text-emerald-100/80 hover:bg-white/10 hover:text-white",
              collapsed && "justify-center"
            )
          }
          title={collapsed ? item.name : undefined}
        >
          <item.icon className={cn("shrink-0", collapsed ? "h-5 w-5" : "mr-3 h-5 w-5")} />
          {!collapsed && <span>{item.name}</span>}
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        title={collapsed ? item.name : undefined}
        onClick={() => {
          if (collapsed) {
            navigate(item.children[0].href);
            return;
          }
          setOpen((current) => !current);
        }}
        className={cn(
          "flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
          childActive ? "bg-emerald-400 text-emerald-950" : "text-emerald-100/80 hover:bg-white/10 hover:text-white",
          collapsed && "justify-center"
        )}
      >
        <item.icon className={cn("shrink-0", collapsed ? "h-5 w-5" : "mr-3 h-5 w-5")} />
        {!collapsed && <span className="flex-1 text-left">{item.name}</span>}
        {!collapsed && <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />}
      </button>
      {!collapsed && open && (
        <ul className="mt-1 space-y-1 pl-9">
          {item.children.map((child) => (
            <li key={child.href}>
              <NavLink
                to={child.href}
                end={child.end !== false}
                className={({ isActive }) =>
                  cn(
                    "block rounded-md px-2 py-1.5 text-sm transition-colors",
                    isActive ? "bg-white/15 font-medium text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"
                  )
                }
              >
                {child.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function Sidebar({ collapsed, setCollapsed }) {
  const { hasRole, hasPermission } = useAuth();

  // Filter navigation items based on user's roles and permissions
  const visibleGroups = navigationData
    .map((group) => {
      const filteredItems = group.items.flatMap((item) => {
        if (item.allowedRoles && !hasRole(item.allowedRoles)) return [];
        if (item.children?.length) {
          const children = item.children.filter((child) => !child.permissionsNeeded || hasPermission(child.permissionsNeeded));
          return children.length ? [{ ...item, children }] : [];
        }
        if (item.permissionsNeeded && !hasPermission(item.permissionsNeeded)) return [];
        return [item];
      });
      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0);
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r border-emerald-900 bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && <BrandMark tone="dark" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-md p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <nav className="space-y-6 px-3">
          {visibleGroups.map((group) => (
            <div key={group.group}>
              {!collapsed && (
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-emerald-200/70">
                  {group.group}
                </h4>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <NavEntry key={item.name} item={item} collapsed={collapsed} />
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

    </aside>
  );
}
