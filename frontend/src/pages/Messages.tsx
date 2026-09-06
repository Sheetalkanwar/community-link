import { useEffect, useRef, useState } from "react";

import { getConnections } from "../api/connections";
import {
  getMessages,
  sendMessage,
} from "../api/messages";

interface Connection {
  connection_id: number;
  user_id: number;
  name: string;
  bio: string | null;
  location: string | null;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
}

function Messages() {
  const [connections, setConnections] =
    useState<Connection[]>([]);

  const [selectedUser, setSelectedUser] =
    useState<Connection | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [newMessage, setNewMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [currentUserId, setCurrentUserId] =
    useState<number | null>(null);

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(null);

  const shouldScrollRef =
    useRef(true);

  /*
   * Get current user ID
   */
  useEffect(() => {
    const token =
      localStorage.getItem("access_token");

    if (!token) return;

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      setCurrentUserId(
        Number(payload.sub)
      );
    } catch {
      setCurrentUserId(null);
    }
  }, []);

  /*
   * Load connections
   */
  useEffect(() => {
    async function loadConnections() {
      try {
        const data =
          await getConnections();

        setConnections(data);

        if (data.length > 0) {
          setSelectedUser(data[0]);
        }
      } catch (error: any) {
        setError(
          error.response?.data?.detail ||
            "Unable to load connections"
        );
      } finally {
        setLoading(false);
      }
    }

    loadConnections();
  }, []);

  /*
   * Load messages
   */
  async function loadMessages(
    silent = false
  ) {
    if (!selectedUser) return;

    try {
      if (!silent) {
        setLoadingMessages(true);
      }

      const data =
        await getMessages(
          selectedUser.user_id
        );

      setMessages(data);

      /*
       * Only scroll when:
       * - opening a conversation
       * - sending a message
       * - already near bottom
       */
      if (
        shouldScrollRef.current &&
        messagesContainerRef.current
      ) {
        requestAnimationFrame(() => {
          const container =
            messagesContainerRef.current;

          if (container) {
            container.scrollTop =
              container.scrollHeight;
          }
        });
      }
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to load messages"
      );
    } finally {
      if (!silent) {
        setLoadingMessages(false);
      }
    }
  }

  /*
   * Load when conversation changes
   */
  useEffect(() => {
    if (!selectedUser) return;

    shouldScrollRef.current = true;

    loadMessages();
  }, [selectedUser]);

  /*
   * Refresh messages silently
   */
  useEffect(() => {
    if (!selectedUser) return;

    const interval =
      setInterval(() => {
        /*
         * Do not force scroll during refresh.
         */
        shouldScrollRef.current = false;

        loadMessages(true);
      }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedUser]);

  /*
   * Detect whether user is near bottom
   */
  function handleMessageScroll() {
    const container =
      messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    shouldScrollRef.current =
      distanceFromBottom < 100;
  }

  /*
   * Send message
   */
  async function handleSendMessage() {
    if (
      !selectedUser ||
      !newMessage.trim()
    ) {
      return;
    }

    try {
      setSending(true);
      setError("");

      shouldScrollRef.current = true;

      const data =
        await sendMessage(
          selectedUser.user_id,
          newMessage.trim()
        );

      setMessages((previous) => [
        ...previous,
        data.data,
      ]);

      setNewMessage("");

      requestAnimationFrame(() => {
        const container =
          messagesContainerRef.current;

        if (container) {
          container.scrollTop =
            container.scrollHeight;
        }
      });
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to send message"
      );
    } finally {
      setSending(false);
    }
  }

  /*
   * Format time
   */
  function formatTime(
    timestamp: string
  ) {
    return new Date(
      timestamp
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

          <p className="text-sm font-medium text-gray-500">
            Loading your conversations...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Error
   */
  if (error && connections.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb]">
        <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            !
          </div>

          <p className="font-semibold text-red-600">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f7fb]">

      {/* Animated background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-32 top-10 h-80 w-80 animate-pulse rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="absolute right-[-120px] top-32 h-96 w-96 animate-pulse rounded-full bg-purple-300/20 blur-3xl [animation-delay:1s]" />

        <div className="absolute bottom-[-160px] left-1/3 h-96 w-96 animate-pulse rounded-full bg-blue-300/10 blur-3xl [animation-delay:2s]" />

      </div>


      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* Page Header */}

        <div className="mb-7">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 rotate-[-4deg] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 hover:rotate-3 hover:scale-105">
              ✦
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                Community
              </p>

              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Messages
              </h1>

            </div>

          </div>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Stay connected with people in your
            community and keep your conversations
            going.
          </p>

        </div>


        {/* No connections */}

        {connections.length === 0 ? (
          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-12 text-center shadow-[0_25px_70px_-30px_rgba(79,70,229,0.3)] backdrop-blur-xl">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-indigo-100 to-purple-100 text-3xl">
              ✦
            </div>

            <h2 className="mt-6 text-xl font-black text-gray-900">
              No conversations yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Connect with someone first and
              start exchanging ideas, skills and
              experiences.
            </p>

          </div>
        ) : (

          /* Chat Application */

          <div className="grid h-[calc(100vh-220px)] min-h-[620px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_30px_90px_-35px_rgba(79,70,229,0.3)] backdrop-blur-xl md:grid-cols-[320px_1fr]">

            {/* ============================= */}
            {/* CONNECTION SIDEBAR */}
            {/* ============================= */}

            <aside className="hidden border-r border-gray-100 bg-white/70 md:flex md:flex-col">

              <div className="border-b border-gray-100 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-500">
                      Your network
                    </p>

                    <h2 className="mt-1 text-lg font-black text-gray-900">
                      Conversations
                    </h2>

                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                    {connections.length}
                  </span>

                </div>

              </div>


              <div className="flex-1 overflow-y-auto p-3">

                {connections.map(
                  (connection) => {

                    const isSelected =
                      selectedUser?.user_id ===
                      connection.user_id;

                    return (
                      <button
                        key={
                          connection.user_id
                        }
                        type="button"
                        onClick={() => {
                          setSelectedUser(
                            connection
                          );
                          setError("");
                        }}
                        className={`group mb-2 w-full rounded-2xl p-4 text-left transition-all duration-300 ${
                          isSelected
                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm"
                            : "hover:-translate-y-0.5 hover:bg-gray-50"
                        }`}
                      >

                        <div className="flex items-center gap-3">

                          <div
                            className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black transition-transform duration-300 group-hover:scale-105 ${
                              isSelected
                                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                                : "bg-indigo-100 text-indigo-600"
                            }`}
                          >
                            {connection.name
                              .charAt(0)
                              .toUpperCase()}

                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />

                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate font-bold text-gray-900">
                              {connection.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-gray-400">
                              {connection.location ||
                                "Community member"}
                            </p>

                          </div>

                          {isSelected && (
                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                          )}

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

            </aside>


            {/* ============================= */}
            {/* CHAT */}
            {/* ============================= */}

            <section className="flex min-w-0 flex-col">

              {selectedUser && (
                <>

                  {/* Chat Header */}

                  <header className="flex items-center justify-between border-b border-gray-100 bg-white/80 px-5 py-4 backdrop-blur-xl sm:px-7">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-black text-white shadow-lg shadow-indigo-500/20">

                        {selectedUser.name
                          .charAt(0)
                          .toUpperCase()}

                        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />

                      </div>

                      <div className="min-w-0">

                        <h2 className="truncate font-black text-gray-900">
                          {selectedUser.name}
                        </h2>

                        <p className="mt-0.5 truncate text-xs text-emerald-600">
                          ● Connected
                        </p>

                      </div>

                    </div>

                    <div className="hidden rounded-xl bg-gray-50 px-3 py-2 text-xs font-medium text-gray-400 sm:block">
                      {messages.length}{" "}
                      messages
                    </div>

                  </header>


                  {/* Mobile conversation selector */}

                  <div className="border-b border-gray-100 bg-white px-4 py-3 md:hidden">

                    <select
                      value={
                        selectedUser.user_id
                      }
                      onChange={(e) => {
                        const connection =
                          connections.find(
                            (item) =>
                              item.user_id ===
                              Number(
                                e.target.value
                              )
                          );

                        if (connection) {
                          setSelectedUser(
                            connection
                          );
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500"
                    >
                      {connections.map(
                        (connection) => (
                          <option
                            key={
                              connection.user_id
                            }
                            value={
                              connection.user_id
                            }
                          >
                            {connection.name}
                          </option>
                        )
                      )}
                    </select>

                  </div>


                  {/* Messages */}

                  <div
                    ref={
                      messagesContainerRef
                    }
                    onScroll={
                      handleMessageScroll
                    }
                    className="flex-1 overflow-y-auto bg-gradient-to-b from-white via-[#fbfbff] to-indigo-50/30 px-4 py-6 sm:px-7"
                  >

                    {loadingMessages ? (

                      <div className="flex h-full items-center justify-center">

                        <div className="text-center">

                          <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                          <p className="text-xs font-medium text-gray-400">
                            Loading conversation...
                          </p>

                        </div>

                      </div>

                    ) : messages.length === 0 ? (

                      <div className="flex h-full items-center justify-center">

                        <div className="max-w-sm text-center">

                          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-indigo-100 to-purple-100 text-3xl shadow-inner">
                            ✦
                          </div>

                          <h3 className="mt-5 font-black text-gray-900">
                            Start the conversation
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            Say hello to{" "}
                            {selectedUser.name}
                            {" "}and start
                            sharing ideas.
                          </p>

                        </div>

                      </div>

                    ) : (

                      <div className="mx-auto max-w-3xl space-y-5">

                        {messages.map(
                          (message) => {

                            const isMine =
                              message.sender_id ===
                              currentUserId;

                            return (
                              <div
                                key={
                                  message.id
                                }
                                className={`flex ${
                                  isMine
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >

                                <div
                                  className={`group max-w-[80%] sm:max-w-[70%] ${
                                    isMine
                                      ? "items-end"
                                      : "items-start"
                                  }`}
                                >

                                  <div
                                    className={`rounded-[1.35rem] px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
                                      isMine
                                        ? "rounded-br-md bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-indigo-500/15"
                                        : "rounded-bl-md border border-gray-100 bg-white text-gray-900"
                                    }`}
                                  >

                                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                      {
                                        message.content
                                      }
                                    </p>

                                  </div>

                                  <p
                                    className={`mt-1.5 px-1 text-[10px] font-medium ${
                                      isMine
                                        ? "text-right text-gray-400"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {formatTime(
                                      message.created_at
                                    )}
                                  </p>

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    )}

                  </div>


                  {/* Error */}

                  {error && (
                    <div className="border-t border-red-100 bg-red-50 px-5 py-2.5 text-center text-xs font-medium text-red-600">
                      {error}
                    </div>
                  )}


                  {/* Composer */}

                  <div className="border-t border-gray-100 bg-white/90 p-4 backdrop-blur-xl sm:p-5">

                    <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-2 transition-all duration-300 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-indigo-500/5">

                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) =>
                          setNewMessage(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !e.shiftKey
                          ) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={`Message ${selectedUser.name}...`}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                      />

                      <button
                        type="button"
                        onClick={
                          handleSendMessage
                        }
                        disabled={
                          sending ||
                          !newMessage.trim()
                        }
                        className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        {sending ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Sending
                          </>
                        ) : (
                          <>
                            Send
                            <span className="text-base">
                              →
                            </span>
                          </>
                        )}

                      </button>

                    </div>

                    <p className="mx-auto mt-2 max-w-3xl px-2 text-[10px] text-gray-400">
                      Press Enter to send
                    </p>

                  </div>

                </>
              )}

            </section>

          </div>
        )}

      </div>

    </main>
  );
}

export default Messages;