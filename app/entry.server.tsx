import { renderToString } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { createInstance } from "i18next";
import { EntryContext } from "@remix-run/react/entry";
import { RemixServer } from "@remix-run/react";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const i18n = createInstance();
  await i18n.use(initReactI18next).init({
    supportedLngs: ["fr", "en"],
    defaultNS: "common",
    fallbackLng: "en",
    react: { useSuspense: false },
  });

  const markup = renderToString(
    <I18nextProvider i18n={i18n}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
