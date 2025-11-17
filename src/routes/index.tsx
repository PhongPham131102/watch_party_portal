import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import RolesPage from "@/pages/Roles";
import UsersPage from "@/pages/Users";
import GenresPage from "@/pages/Genres";
import DirectorsPage from "@/pages/Directors";
import ActorsPage from "@/pages/Actors";
import CountriesPage from "@/pages/Countries";
import MoviesPage from "@/pages/Movies";
import EpisodesPage from "@/pages/Episodes";
import EpisodeDetailPage from "@/pages/EpisodeDetail";
import { APP_ROUTES } from "@/constants";
import { ProtectedRoute, PublicRoute } from "@/components/common";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={APP_ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path={APP_ROUTES.HOME}
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path={APP_ROUTES.ROLES}
        element={
          <ProtectedRoute>
            <RolesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={APP_ROUTES.GENRES}
        element={
          <ProtectedRoute>
            <GenresPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={APP_ROUTES.DIRECTORS}
        element={
          <ProtectedRoute>
            <DirectorsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={APP_ROUTES.ACTORS}
        element={
          <ProtectedRoute>
            <ActorsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={APP_ROUTES.COUNTRIES}
        element={
          <ProtectedRoute>
            <CountriesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={APP_ROUTES.MOVIES}
        element={
          <ProtectedRoute>
            <MoviesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={APP_ROUTES.EPISODES}
        element={
          <ProtectedRoute>
            <EpisodesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={APP_ROUTES.EPISODE_DETAIL}
        element={
          <ProtectedRoute>
            <EpisodeDetailPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
    </Routes>
  );
}
