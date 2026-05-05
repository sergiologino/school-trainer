import { Navigate, Routes, Route } from 'react-router-dom';
import LoginPage from '@/shell/LoginPage';
import { HubPage } from '@/shell/HubPage';
import { MathPortal } from '@/shell/MathPortal';
import { EnglishPortal } from '@/shell/EnglishPortal';
import { RussianPortal } from '@/shell/RussianPortal';
import { useUnifiedStore } from '@/store/useUnifiedStore';

import type { ReactNode } from 'react';

function RequireAuth({ children }: { children: ReactNode }) {
  const user = useUnifiedStore((s) => s.user);
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export function AppShell() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <HubPage />
          </RequireAuth>
        }
      />
      <Route
        path="/math"
        element={
          <RequireAuth>
            <MathPortal />
          </RequireAuth>
        }
      />
      <Route
        path="/english"
        element={
          <RequireAuth>
            <EnglishPortal />
          </RequireAuth>
        }
      />
      <Route
        path="/russian"
        element={
          <RequireAuth>
            <RussianPortal />
          </RequireAuth>
        }
      />
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function RootRedirect() {
  const user = useUnifiedStore((s) => s.user);
  return user ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />;
}
