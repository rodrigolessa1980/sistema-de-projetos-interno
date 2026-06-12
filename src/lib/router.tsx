import {
  createContext,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type RouterContextValue = {
  pathname: string;
  push: (href: string) => void;
  replace: (href: string) => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);

function normalizePath(path: string) {
  return path || "/";
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));

  const updatePathname = useCallback(() => {
    setPathname(normalizePath(window.location.pathname));
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", updatePathname);
    return () => window.removeEventListener("popstate", updatePathname);
  }, [updatePathname]);

  const navigate = useCallback((href: string, mode: "push" | "replace") => {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) {
      window.location.assign(url.toString());
      return;
    }

    window.history[mode === "push" ? "pushState" : "replaceState"](null, "", url);
    setPathname(normalizePath(url.pathname));
  }, []);

  const value = useMemo(
    () => ({
      pathname,
      push: (href: string) => navigate(href, "push"),
      replace: (href: string) => navigate(href, "replace"),
    }),
    [navigate, pathname]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

function useRouterContext() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("Router hooks must be used inside RouterProvider");
  }
  return context;
}

export function useRouter() {
  const { push, replace } = useRouterContext();
  return { push, replace };
}

export function usePathname() {
  return useRouterContext().pathname;
}

export function useParams<T extends Record<string, string> = Record<string, string>>() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const params: Record<string, string> = {};

  if (segments[0] === "projects" && segments[1]) params.id = decodeURIComponent(segments[1]);
  if (segments[0] === "tasks" && segments[1]) params.id = decodeURIComponent(segments[1]);
  if (segments[0] === "reports" && segments[1] === "projects" && segments[2]) {
    params.id = decodeURIComponent(segments[2]);
  }

  return params as T;
}

export function redirect(href: string): never {
  window.history.replaceState(null, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
  throw new Error(`Redirected to ${href}`);
}

export function notFound(): never {
  window.history.replaceState(null, "", "/dashboard");
  window.dispatchEvent(new PopStateEvent("popstate"));
  throw new Error("Page not found");
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

export default function Link({ href, onClick, target, ...props }: LinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      target ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    router.push(href);
  };

  return <a href={href} target={target} onClick={handleClick} {...props} />;
}
