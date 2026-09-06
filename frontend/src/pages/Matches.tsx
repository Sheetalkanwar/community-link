import { useEffect, useState } from "react";
import { getMatches } from "../api/matches";
import { sendConnectionRequest } from "../api/connections";

interface MatchedSkill {
  skill: string;
  level: string | null;
}

interface Match {
  user_id: number;
  name: string;
  bio: string | null;
  location: string | null;
  matched_skills: MatchedSkill[];
}

function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [connectingId, setConnectingId] =
    useState<number | null>(null);

  const [connectedIds, setConnectedIds] =
    useState<number[]>([]);

  useEffect(() => {
    async function loadMatches() {
      try {
        setError("");

        const data = await getMatches();

        setMatches(data);
      } catch (error: any) {
        setError(
          error.response?.data?.detail ||
            "Unable to load matches"
        );
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  async function handleConnect(userId: number) {
    try {
      setConnectingId(userId);
      setError("");

      await sendConnectionRequest(userId);

      setConnectedIds((previous) => [
        ...previous,
        userId,
      ]);
    } catch (error: any) {
      alert(
        error.response?.data?.detail ||
          "Unable to send connection request"
      );
    } finally {
      setConnectingId(null);
    }
  }

  function getInitials(name: string) {
    const parts = name.trim().split(" ");

    if (parts.length >= 2) {
      return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    }

    return name.charAt(0).toUpperCase();
  }

  function getMatchStrength(
    skillCount: number
  ) {
    if (skillCount >= 4) return "Excellent match";
    if (skillCount >= 3) return "Great match";
    if (skillCount >= 2) return "Strong match";

    return "Potential match";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7fb]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:py-14">

          <div className="mb-10">
            <div className="h-4 w-28 animate-pulse rounded-full bg-gray-200" />

            <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-xl bg-gray-200" />

            <div className="mt-3 h-5 w-[28rem] max-w-full animate-pulse rounded-lg bg-gray-100" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-[1.75rem] border border-white bg-white p-7 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-100" />

                  <div className="flex-1">
                    <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>

                <div className="mt-6 h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-gray-100" />

                <div className="mt-6 flex gap-2">
                  <div className="h-8 w-20 animate-pulse rounded-full bg-gray-100" />
                  <div className="h-8 w-24 animate-pulse rounded-full bg-gray-100" />
                </div>

                <div className="mt-7 h-12 animate-pulse rounded-xl bg-gray-100" />
              </div>
            ))}

          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb] px-5">
        <div className="w-full max-w-md rounded-[1.75rem] border border-red-100 bg-white p-8 text-center shadow-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            !
          </div>

          <h2 className="mt-5 text-xl font-black text-gray-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7fb]">

      {/* Animated background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-96 w-96 animate-pulse rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="absolute right-[-120px] top-32 h-96 w-96 animate-pulse rounded-full bg-purple-300/20 blur-3xl [animation-delay:1s]" />

        <div className="absolute bottom-[-180px] left-1/3 h-[28rem] w-[28rem] animate-pulse rounded-full bg-fuchsia-300/10 blur-3xl [animation-delay:2s]" />

      </div>


      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:py-14">

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 px-6 py-8 shadow-[0_25px_70px_-35px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:px-9 sm:py-10">

          {/* Gradient decoration */}

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/10 blur-2xl" />

          <div className="absolute bottom-[-100px] right-32 h-48 w-48 rounded-full bg-fuchsia-300/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">

            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">

                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />

                SKILL MATCHING

              </div>

              <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">

                Find your
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  {" "}people.
                </span>

              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
                Discover people who can teach the skills
                you want to learn and build meaningful
                connections along the way.
              </p>

            </div>


            {/* Floating 3D visual */}

            <div className="hidden h-36 w-36 shrink-0 md:block">

              <div className="relative h-full w-full">

                <div className="absolute left-5 top-5 h-24 w-24 rotate-6 rounded-[1.75rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30 transition-transform duration-500 hover:rotate-12 hover:scale-110" />

                <div className="absolute left-12 top-12 flex h-24 w-24 -rotate-6 items-center justify-center rounded-[1.75rem] border-4 border-white bg-gradient-to-br from-purple-500 to-fuchsia-500 text-3xl font-black text-white shadow-2xl transition-transform duration-500 hover:-rotate-12 hover:scale-110">
                  ↗
                </div>

                <div className="absolute right-0 top-1 h-7 w-7 rounded-full bg-indigo-400/50 blur-sm" />

                <div className="absolute bottom-0 left-0 h-5 w-5 rounded-full bg-purple-400/50" />

              </div>

            </div>

          </div>


          {/* Quick stats */}

          <div className="relative mt-8 flex flex-wrap gap-3">

            <div className="rounded-2xl border border-gray-100 bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xl font-black text-gray-900">
                {matches.length}
              </p>

              <p className="text-xs font-medium text-gray-400">
                {matches.length === 1
                  ? "Potential match"
                  : "Potential matches"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xl font-black text-indigo-600">
                {matches.reduce(
                  (total, match) =>
                    total +
                    match.matched_skills.length,
                  0
                )}
              </p>

              <p className="text-xs font-medium text-gray-400">
                Skill connections
              </p>
            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {matches.length === 0 ? (
          <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-10 text-center shadow-[0_25px_70px_-35px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-16">

            <div className="mx-auto flex h-24 w-24 rotate-[-4deg] items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-100 to-purple-100 text-4xl shadow-lg transition-transform duration-500 hover:rotate-6 hover:scale-110">
              ✦
            </div>

            <h2 className="mt-7 text-2xl font-black text-gray-900">
              Your next connection is waiting
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Add a few skills you want to learn to your
              profile and we'll find people who can teach
              them.
            </p>

          </section>
        ) : (

          /* ================================================= */
          /* MATCH GRID */
          /* ================================================= */

          <div className="grid gap-6 md:grid-cols-2">

            {matches.map((match) => {

              const isConnecting =
                connectingId === match.user_id;

              const isConnected =
                connectedIds.includes(
                  match.user_id
                );

              const matchStrength =
                getMatchStrength(
                  match.matched_skills.length
                );

              return (
                <article
                  key={match.user_id}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 p-7 shadow-[0_20px_55px_-35px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:rotate-[0.25deg] hover:shadow-[0_30px_70px_-30px_rgba(79,70,229,0.3)]"
                >

                  {/* Card glow */}

                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-100/60 blur-3xl transition-all duration-700 group-hover:scale-150" />

                  <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-100/40 blur-3xl transition-all duration-700 group-hover:scale-150" />


                  <div className="relative">

                    {/* Match badge */}

                    <div className="mb-6 flex items-center justify-between">

                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        {matchStrength}

                      </span>

                      <span className="text-xs font-medium text-gray-400">
                        {match.matched_skills.length}{" "}
                        {match.matched_skills.length === 1
                          ? "skill"
                          : "skills"} matched
                      </span>

                    </div>


                    {/* Person */}

                    <div className="flex items-center gap-4">

                      <div className="relative">

                        <div className="absolute inset-0 translate-y-2 scale-90 rounded-2xl bg-indigo-500/20 blur-lg transition-all duration-500 group-hover:translate-y-3 group-hover:scale-110" />

                        <div className="relative flex h-16 w-16 rotate-[-3deg] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-xl font-black text-white shadow-xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-105">

                          {getInitials(match.name)}

                        </div>

                      </div>


                      <div className="min-w-0">

                        <h2 className="truncate text-xl font-black text-gray-900">
                          {match.name}
                        </h2>

                        {match.location ? (
                          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500">
                            <span className="text-indigo-500">
                              ⌖
                            </span>

                            {match.location}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-gray-400">
                            Community member
                          </p>
                        )}

                      </div>

                    </div>


                    {/* Bio */}

                    <div className="mt-6 min-h-[56px]">

                      {match.bio ? (
                        <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                          {match.bio}
                        </p>
                      ) : (
                        <p className="text-sm italic leading-6 text-gray-400">
                          This member hasn't added a bio yet.
                        </p>
                      )}

                    </div>


                    {/* Divider */}

                    <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />


                    {/* Matched skills */}

                    <div>

                      <div className="mb-3 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
                            ↑
                          </div>

                          <p className="text-sm font-bold text-gray-800">
                            Can teach you
                          </p>

                        </div>

                        <span className="text-xs font-semibold text-indigo-500">
                          {match.matched_skills.length}
                        </span>

                      </div>


                      <div className="flex min-h-[38px] flex-wrap gap-2">

                        {match.matched_skills.map(
                          (skill, index) => (
                            <span
                              key={`${skill.skill}-${index}`}
                              className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 text-xs font-bold text-indigo-600 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                            >
                              {skill.skill}

                              {skill.level && (
                                <span className="ml-1 font-medium text-indigo-400">
                                  · {skill.level}
                                </span>
                              )}
                            </span>
                          )
                        )}

                      </div>

                    </div>


                    {/* Connect */}

                    <button
                      type="button"
                      onClick={() =>
                        handleConnect(
                          match.user_id
                        )
                      }
                      disabled={
                        isConnecting ||
                        isConnected
                      }
                      className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
                        isConnected
                          ? "cursor-default bg-emerald-50 text-emerald-600"
                          : "bg-gray-900 text-white shadow-lg shadow-gray-900/10 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/20 active:translate-y-0"
                      } disabled:opacity-70`}
                    >

                      {isConnecting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Sending request...
                        </>
                      ) : isConnected ? (
                        <>
                          <span>✓</span>
                          Request sent
                        </>
                      ) : (
                        <>
                          <span className="text-base">
                            +
                          </span>
                          Connect with {match.name}
                        </>
                      )}

                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}

export default Matches;