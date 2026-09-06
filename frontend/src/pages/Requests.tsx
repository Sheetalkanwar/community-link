import { useEffect, useState } from "react";

import {
  getReceivedRequests,
  acceptConnection,
  rejectConnection,
} from "../api/connections";

interface ConnectionRequest {
  connection_id: number;
  user_id: number;
  name: string;
  bio: string | null;
  location: string | null;
  status: string;
}

function Requests() {
  const [requests, setRequests] =
    useState<ConnectionRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  async function loadRequests() {
    try {
      setError("");

      const data =
        await getReceivedRequests();

      setRequests(data);
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to load connection requests"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleAccept(
    connectionId: number
  ) {
    try {
      setProcessingId(connectionId);
      setSuccessMessage("");
      setError("");

      await acceptConnection(connectionId);

      setRequests((currentRequests) =>
        currentRequests.filter(
          (request) =>
            request.connection_id !==
            connectionId
        )
      );

      setSuccessMessage(
        "Connection accepted successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to accept connection"
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(
    connectionId: number
  ) {
    try {
      setProcessingId(connectionId);
      setSuccessMessage("");
      setError("");

      await rejectConnection(connectionId);

      setRequests((currentRequests) =>
        currentRequests.filter(
          (request) =>
            request.connection_id !==
            connectionId
        )
      );

      setSuccessMessage(
        "Connection request declined."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to reject connection"
      );
    } finally {
      setProcessingId(null);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7fb]">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:py-14">

          <div className="mb-10">
            <div className="h-4 w-32 animate-pulse rounded-full bg-gray-200" />

            <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-xl bg-gray-200" />

            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-lg bg-gray-100" />
          </div>

          <div className="space-y-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-[1.75rem] border border-white bg-white p-7 shadow-sm"
              >
                <div className="flex items-center gap-4">

                  <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-100" />

                  <div className="flex-1">
                    <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
                  </div>

                </div>

                <div className="mt-6 h-4 w-full animate-pulse rounded bg-gray-100" />

                <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-gray-100" />

                <div className="mt-6 flex gap-3">
                  <div className="h-11 w-28 animate-pulse rounded-xl bg-gray-100" />
                  <div className="h-11 w-28 animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}

          </div>
        </div>
      </main>
    );
  }

  if (error && requests.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb] px-5">

        <div className="w-full max-w-md rounded-[1.75rem] border border-red-100 bg-white p-8 text-center shadow-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl font-black text-red-500">
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

      {/* ================================================= */}
      {/* ANIMATED BACKGROUND */}
      {/* ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-96 w-96 animate-pulse rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="absolute right-[-120px] top-40 h-96 w-96 animate-pulse rounded-full bg-purple-300/20 blur-3xl [animation-delay:1s]" />

        <div className="absolute bottom-[-180px] left-1/3 h-[28rem] w-[28rem] animate-pulse rounded-full bg-fuchsia-300/10 blur-3xl [animation-delay:2s]" />

      </div>


      <div className="relative mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:py-14">

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 px-6 py-8 shadow-[0_25px_70px_-35px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:px-9 sm:py-10">

          {/* Decorative glow */}

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="absolute bottom-[-100px] right-32 h-48 w-48 rounded-full bg-purple-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold tracking-wide text-indigo-600">

                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />

                COMMUNITY

              </div>

              <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">

                Connection
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  {" "}requests.
                </span>

              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
                Meet people who want to learn,
                teach and grow together with you.
              </p>

            </div>


            {/* 3D floating icon */}

            <div className="relative hidden h-32 w-32 shrink-0 sm:block">

              <div className="absolute left-5 top-5 h-24 w-24 rotate-6 rounded-[1.75rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30 transition-all duration-500 hover:rotate-12 hover:scale-110" />

              <div className="absolute left-10 top-10 flex h-24 w-24 -rotate-6 items-center justify-center rounded-[1.75rem] border-4 border-white bg-gradient-to-br from-purple-500 to-fuchsia-500 text-3xl font-black text-white shadow-2xl transition-all duration-500 hover:-rotate-12 hover:scale-110">
                +
              </div>

              <div className="absolute right-0 top-0 h-5 w-5 rounded-full bg-indigo-400/50 blur-sm" />

              <div className="absolute bottom-0 left-0 h-4 w-4 rounded-full bg-purple-400/50" />

            </div>

          </div>


          {/* Request count */}

          <div className="relative mt-8 inline-flex items-center gap-3 rounded-2xl border border-gray-100 bg-white/80 px-4 py-3 shadow-sm">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
              {requests.length}
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                Pending requests
              </p>

              <p className="text-xs text-gray-400">
                Waiting for your response
              </p>
            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-600 shadow-sm">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              ✓
            </div>

            {successMessage}

          </div>
        )}


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}


        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {requests.length === 0 ? (
          <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-10 text-center shadow-[0_25px_70px_-35px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-16">

            <div className="mx-auto flex h-24 w-24 rotate-[-4deg] items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-100 to-purple-100 text-4xl text-indigo-500 shadow-lg transition-all duration-500 hover:rotate-6 hover:scale-110">
              ✓
            </div>

            <h2 className="mt-7 text-2xl font-black text-gray-900">
              You're all caught up
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              You don't have any pending connection
              requests right now. New connections will
              appear here.
            </p>

          </section>
        ) : (

          /* ================================================= */
          /* REQUESTS */
          /* ================================================= */

          <div className="space-y-5">

            {requests.map((request) => {

              const isProcessing =
                processingId ===
                request.connection_id;

              return (
                <article
                  key={request.connection_id}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 p-7 shadow-[0_20px_55px_-35px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(79,70,229,0.25)]"
                >

                  {/* Card glow */}

                  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-100/60 blur-3xl transition-all duration-700 group-hover:scale-150" />

                  <div className="relative">

                    {/* Top */}

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                      <div className="flex items-center gap-4">

                        {/* 3D Avatar */}

                        <div className="relative">

                          <div className="absolute inset-0 translate-y-2 scale-90 rounded-2xl bg-indigo-500/20 blur-lg transition-all duration-500 group-hover:translate-y-3 group-hover:scale-110" />

                          <div className="relative flex h-16 w-16 rotate-[-3deg] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-xl font-black text-white shadow-xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-105">

                            {getInitials(
                              request.name
                            )}

                          </div>

                        </div>


                        <div>

                          <h2 className="text-xl font-black text-gray-900">
                            {request.name}
                          </h2>

                          {request.location ? (
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                              <span className="text-indigo-500">
                                ⌖
                              </span>

                              {request.location}
                            </p>
                          ) : (
                            <p className="mt-1 text-sm text-gray-400">
                              Community member
                            </p>
                          )}

                        </div>

                      </div>


                      {/* Status */}

                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600">

                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />

                        Pending

                      </span>

                    </div>


                    {/* Bio */}

                    <div className="mt-6">

                      {request.bio ? (
                        <p className="max-w-3xl text-sm leading-7 text-gray-600">
                          {request.bio}
                        </p>
                      ) : (
                        <p className="text-sm italic text-gray-400">
                          This member hasn't added a bio yet.
                        </p>
                      )}

                    </div>


                    {/* Divider */}

                    <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />


                    {/* Actions */}

                    <div className="flex flex-col gap-3 sm:flex-row">

                      <button
                        type="button"
                        onClick={() =>
                          handleAccept(
                            request.connection_id
                          )
                        }
                        disabled={isProcessing}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        {isProcessing ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                            Processing...
                          </>
                        ) : (
                          <>
                            <span className="text-base">
                              ✓
                            </span>

                            Accept connection
                          </>
                        )}

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleReject(
                            request.connection_id
                          )
                        }
                        disabled={isProcessing}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-100 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        <span className="text-base">
                          ×
                        </span>

                        Decline

                      </button>

                    </div>

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

export default Requests;