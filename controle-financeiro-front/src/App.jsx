import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CreditCard,
  CalendarDays,
  Plus,
  Wallet,
  CheckCircle2,
  Smartphone,
  Repeat,
  Trash2,
  Pencil,
  Save,
  X,
} from "lucide-react";
import {
  SiAirbnb,
  SiAirtable,
  SiAliexpress,
  SiAmericanexpress,
  SiAnthropic,
  SiApple,
  SiApplemusic,
  SiApplepay,
  SiApplepodcasts,
  SiAppletv,
  SiAsana,
  SiAtlassian,
  SiAudible,
  SiBinance,
  SiBitcoin,
  SiBookingdotcom,
  SiCanva,
  SiCashapp,
  SiClaude,
  SiClickup,
  SiCoursera,
  SiCrunchyroll,
  SiDailymotion,
  SiDazn,
  SiDiscord,
  SiDropbox,
  SiDuolingo,
  SiEpicgames,
  SiFacebook,
  SiFigma,
  SiFiverr,
  SiGithub,
  SiGitlab,
  SiGoogle,
  SiGooglecalendar,
  SiGoogledrive,
  SiGooglegemini,
  SiGooglemeet,
  SiGoogleplay,
  SiGoogletv,
  SiHbomax,
  SiHubspot,
  SiIfood,
  SiInstagram,
  SiJira,
  SiKhanacademy,
  SiLinear,
  SiMailchimp,
  SiMastercard,
  SiMax,
  SiMedium,
  SiMercadopago,
  SiMiro,
  SiMonzo,
  SiN26,
  SiNetflix,
  SiNotion,
  SiNubank,
  SiOnlyfans,
  SiOpenai,
  SiParamountplus,
  SiPandora,
  SiPatreon,
  SiPaypal,
  SiPicpay,
  SiPinterest,
  SiPix,
  SiPlaystation,
  SiPlex,
  SiPocketcasts,
  SiReddit,
  SiRevolut,
  SiRiotgames,
  SiRoku,
  SiSalesforce,
  SiSamsung,
  SiShopee,
  SiShopify,
  SiSlack,
  SiSnapchat,
  SiSoundcloud,
  SiSpotify,
  SiSquarespace,
  SiSteam,
  SiStripe,
  SiSubstack,
  SiTelegram,
  SiTidal,
  SiTiktok,
  SiTodoist,
  SiTrello,
  SiTwitch,
  SiUber,
  SiUbereats,
  SiUdemy,
  SiUpwork,
  SiVenmo,
  SiVimeo,
  SiVisa,
  SiVivo,
  SiWalmart,
  SiWhatsapp,
  SiWise,
  SiWix,
  SiWoocommerce,
  SiWordpress,
  SiX,
  SiYoutube,
  SiYoutubemusic,
  SiZapier,
  SiZelle,
  SiZendesk,
  SiZoom,
} from "react-icons/si";
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const SELECTED_BILLING_MONTH_CACHE_KEY =
  "controleFinanceiro.selectedBillingMonth";
const HISTORY_VIEW_BY_BILLING = "billing";
const HISTORY_VIEW_BY_EXPENSE_DATE = "expense-date";
const initialCards = [
  {
    id: 1,
    name: "Nubank",
    closeDay: 2,
    dueDay: 9,
    paid: false,
    tone: "from-purple-600 to-fuchsia-600",
  },
  {
    id: 2,
    name: "Santander",
    closeDay: null,
    dueDay: 12,
    paid: false,
    tone: "from-red-600 to-rose-700",
  },
  {
    id: 3,
    name: "Inter",
    closeDay: 6,
    dueDay: 12,
    paid: false,
    tone: "from-orange-500 to-amber-600",
  },
];
const initialCardBaseCharges = [
  {
    id: 1,
    cardId: 1,
    monthKey: "2026-06",
    description: "Parcelas em andamento",
    amount: 451.74,
  },
  {
    id: 2,
    cardId: 2,
    monthKey: "2026-06",
    description: "Parcelas em andamento",
    amount: 539.43,
  },
  {
    id: 3,
    cardId: 3,
    monthKey: "2026-06",
    description: "Parcelas em andamento",
    amount: 428.74,
  },
];
const initialFixedBills = [
  {
    id: 1,
    name: "Claro Pós",
    amount: 119.9,
    dueDay: 15,
    paid: false,
    category: "Telefone",
  },
];
const initialSubscriptions = [
  {
    id: 1,
    name: "YouTube Premium",
    amount: 26.9,
    chargeDay: 4,
    cardId: 1,
    category: "Streaming",
    inInvoice: true,
  },
  {
    id: 2,
    name: "iCloud",
    amount: 20,
    chargeDay: 10,
    cardId: 1,
    category: "Recorrente",
    inInvoice: true,
  },
  {
    id: 3,
    name: "Discord",
    amount: 0,
    chargeDay: 26,
    cardId: null,
    category: "Streaming",
    inInvoice: false,
  },
  {
    id: 4,
    name: "Spotify",
    amount: 23.9,
    chargeDay: 8,
    cardId: 1,
    category: "Streaming",
    inInvoice: true,
  },
];
const initialHistory = [
  {
    id: 1,
    cardName: "Nubank",
    description: "Gasto Mês",
    date: "23/03/2026 18:39:47",
    amount: 55.73,
    before: 432.95,
    after: 488.68,
  },
  {
    id: 2,
    cardName: "Nubank",
    description: "Gasto Mês",
    date: "24/04/2026 17:19:41",
    amount: 18.42,
    before: 511.21,
    after: 529.63,
  },
  {
    id: 3,
    cardName: "Nubank",
    description: "Gasto Mês",
    date: "28/04/2026 15:26:43",
    amount: 37.68,
    before: 529.63,
    after: 567.31,
  },
  {
    id: 4,
    cardName: "Nubank",
    description: "Gasto Mês",
    date: "28/04/2026 18:21:08",
    amount: 45.22,
    before: 567.31,
    after: 612.53,
  },
  {
    id: 5,
    cardName: "Nubank",
    description: "Gasto Mês",
    date: "03/05/2026 00:29:00",
    amount: 68,
    before: 612.53,
    after: 680.53,
  },
  {
    id: 6,
    cardName: "Nubank",
    description: "Gasto Mês",
    date: "04/05/2026 17:53:37",
    amount: 9.82,
    before: 680.53,
    after: 690.35,
  },
  {
    id: 7,
    cardName: "Nubank",
    description: "Gasto Mês",
    date: "04/05/2026 18:34:21",
    amount: 50,
    before: 690.35,
    after: 740.35,
  },
];
function padNumber(value) {
  return String(value).padStart(2, "0");
}
function parseMoney(value) {
  const normalizedValue = String(value || "")
    .replaceAll("R$", "")
    .replaceAll(" ", "")
    .replaceAll(".", "")
    .replace(",", ".")
    .trim();
  return Number(normalizedValue);
}
function formatMoneyInput(value) {
  const numericValue = parseMoney(value);
  if (!Number.isFinite(numericValue)) {
    return "";
  }
  return numericValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function formatMoneyTyping(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  return (Number(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function formatBrazilianDateTime(date) {
  return `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()} ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}`;
}
function getCurrentDateTimeLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${padNumber(now.getMonth() + 1)}-${padNumber(now.getDate())}T${padNumber(now.getHours())}:${padNumber(now.getMinutes())}`;
}
function parseBrazilianDate(dateText) {
  const parts = String(dateText || "")
    .replaceAll(",", " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  const datePart = parts[0];
  const timePart = parts[1] || "00:00:00";
  if (!datePart) return null;
  const [day, month, year] = datePart.split("/").map(Number);
  const [hour = 0, minute = 0, second = 0] = timePart.split(":").map(Number);
  if (!day || !month || !year) return null;
  const parsedDate = new Date(year, month - 1, day, hour, minute, second);
  if (Number.isNaN(parsedDate.getTime())) return null;
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day ||
    parsedDate.getHours() !== hour ||
    parsedDate.getMinutes() !== minute ||
    parsedDate.getSeconds() !== second
  ) {
    return null;
  }
  return parsedDate;
}
function parseDateValue(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const dateText = String(value ?? "").trim();
  if (!dateText) return null;

  const brazilianDate = parseBrazilianDate(dateText);
  if (brazilianDate) return brazilianDate;

  const parsedDate = new Date(dateText);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}
function formatApiDateText(value) {
  const parsedDate = parseDateValue(value);
  return parsedDate ? formatBrazilianDateTime(parsedDate) : String(value ?? "");
}
function dateTextToDateTimeLocal(dateText) {
  const parsedDate = parseDateValue(dateText);
  if (!parsedDate) return getCurrentDateTimeLocal();
  return `${parsedDate.getFullYear()}-${padNumber(parsedDate.getMonth() + 1)}-${padNumber(parsedDate.getDate())}T${padNumber(parsedDate.getHours())}:${padNumber(parsedDate.getMinutes())}`;
}
function dateTimeLocalToDateText(dateTimeLocal) {
  if (!dateTimeLocal) return formatBrazilianDateTime(new Date());
  const parsedDate = new Date(dateTimeLocal);
  if (Number.isNaN(parsedDate.getTime())) {
    return formatBrazilianDateTime(new Date());
  }
  return formatBrazilianDateTime(parsedDate);
}
function getMonthKeyFromDateText(dateText) {
  const parsedDate = parseDateValue(dateText);
  if (!parsedDate) return "sem-data";
  return `${parsedDate.getFullYear()}-${padNumber(parsedDate.getMonth() + 1)}`;
}
function getHistoryBillingMonthKey(item) {
  return normalizeMonthKey(
    item?.mesReferencia ??
      item?.MesReferencia ??
      item?.mes_referencia ??
      item?.monthKey ??
      item?.MonthKey ??
      item?.billingMonth ??
      item?.BillingMonth,
  );
}
function getHistoryMonthKey(item) {
  return getHistoryBillingMonthKey(item) || getMonthKeyFromDateText(item.date);
}
function getHistoryExpenseMonthKey(item) {
  return getMonthKeyFromDateText(item.date);
}
function getHistoryMonthKeyByView(item, historyView) {
  return historyView === HISTORY_VIEW_BY_EXPENSE_DATE
    ? getHistoryExpenseMonthKey(item)
    : getHistoryMonthKey(item);
}
function getMonthLabel(monthKey) {
  if (monthKey === "sem-data") return "Sem data";
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}
function getCurrentMonthKey() {
  const today = new Date();
  return `${today.getFullYear()}-${padNumber(today.getMonth() + 1)}`;
}
function readCachedBillingMonth() {
  if (typeof window === "undefined") return "";

  try {
    return normalizeMonthKey(
      window.localStorage.getItem(SELECTED_BILLING_MONTH_CACHE_KEY),
    );
  } catch {
    return "";
  }
}
function saveCachedBillingMonth(monthKey) {
  const normalizedMonthKey = normalizeMonthKey(monthKey);
  if (!normalizedMonthKey || typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      SELECTED_BILLING_MONTH_CACHE_KEY,
      normalizedMonthKey,
    );
  } catch {
    // Ignore storage failures, for example private mode restrictions.
  }
}
function getInitialBillingMonth() {
  return readCachedBillingMonth() || getCurrentMonthKey();
}
function getPreviousMonthKey(monthKey) {
  const [year, month] = String(monthKey || "")
    .split("-")
    .map(Number);
  if (!year || !month) return getCurrentMonthKey();
  const date = new Date(year, month - 2, 1);
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}`;
}
function parseApiMoney(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  const normalizedValue = String(value ?? "").trim();
  if (!normalizedValue) return 0;
  if (normalizedValue.includes(",")) {
    const parsedValue = parseMoney(normalizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }
  const parsedValue = Number(
    normalizedValue.replaceAll("R$", "").replaceAll(" ", ""),
  );
  if (Number.isFinite(parsedValue)) return parsedValue;
  const fallbackValue = parseMoney(normalizedValue);
  return Number.isFinite(fallbackValue) ? fallbackValue : 0;
}
function formatApiMoneyInput(value) {
  return formatMoneyInput(String(parseApiMoney(value)).replace(".", ","));
}
function getSalaryFromDashboardData(data) {
  return parseApiMoney(data?.salary ?? data?.salario ?? 0);
}
async function fetchDashboardData(monthKey) {
  const response = await fetch(`${API_URL}/dashboard?mes=${monthKey}`);
  const responseData = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      responseData?.error || "Erro ao carregar dados do dashboard.",
    );
  }
  return responseData || {};
}
async function saveSalaryForMonth(monthKey, amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    throw new Error("Informe um salário válido.");
  }
  const response = await fetch(`${API_URL}/salario`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mesReferencia: monthKey,
      valor: Number(numericAmount.toFixed(2)),
    }),
  });
  const responseData = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(responseData?.error || "Erro ao salvar salário.");
  }
  return responseData;
}
function getDefaultHistoryMonth(
  history,
  historyView = HISTORY_VIEW_BY_BILLING,
) {
  const availableMonths = getMonthOptionsFromHistory(history, historyView);
  const currentMonth = getCurrentMonthKey();
  if (availableMonths.includes(currentMonth)) return currentMonth;
  return availableMonths[0] || currentMonth;
}
function getMonthOptionsFromHistory(
  history,
  historyView = HISTORY_VIEW_BY_BILLING,
) {
  const monthKeys = Array.from(
    new Set([
      ...history.map((item) => getHistoryMonthKeyByView(item, historyView)),
    ]),
  );
  return monthKeys.sort((a, b) => b.localeCompare(a));
}
function normalizeMonthKey(value) {
  const match = String(value ?? "")
    .trim()
    .match(/^(\d{4})-(\d{2})/);
  if (!match) return "";
  const month = Number(match[2]);
  if (month < 1 || month > 12) return "";
  return `${match[1]}-${match[2]}`;
}
function getApiMonthKey(item) {
  if (typeof item === "string" || typeof item === "number") {
    return normalizeMonthKey(item);
  }
  if (!item || typeof item !== "object") return "";
  return normalizeMonthKey(
    item.mesReferencia ??
      item.MesReferencia ??
      item.mes_referencia ??
      item.monthKey ??
      item.MonthKey ??
      item.mes ??
      item.Mes ??
      item.value ??
      item.Value,
  );
}
function getBillingMonthItems(source) {
  if (Array.isArray(source)) return source;
  if (!source || typeof source !== "object") return [];
  return (
    source.mesesFinanceiros ||
    source.meses ||
    source.months ||
    source.billingMonthOptions ||
    source.data ||
    []
  );
}
function getBillingMonthOptions(source = []) {
  return Array.from(
    new Set(getBillingMonthItems(source).map(getApiMonthKey).filter(Boolean)),
  ).sort((a, b) => b.localeCompare(a));
}
function calculateBaseTotalsByCard(cardBaseCharges, selectedHistoryMonth) {
  return cardBaseCharges.reduce((acc, item) => {
    if (getCardBaseChargeMonthKey(item) !== selectedHistoryMonth) return acc;
    const cardId = getCardBaseChargeCardId(item);
    if (!Number.isFinite(cardId) || cardId <= 0) return acc;
    acc[cardId] = (acc[cardId] || 0) + getCardBaseChargeAmount(item);
    return acc;
  }, {});
}
function calculateVariableTotalsByCard(history, selectedHistoryMonth) {
  return history.reduce((acc, item) => {
    if (getHistoryMonthKey(item) !== selectedHistoryMonth) return acc;
    acc[item.cardName] = (acc[item.cardName] || 0) + getHistoryAmount(item);
    return acc;
  }, {});
}
function calculateRecurringTotalsByCard(subscriptions) {
  return subscriptions.reduce((acc, subscription) => {
    const cardId = getSubscriptionCardId(subscription);
    if (!getSubscriptionInInvoice(subscription) || !cardId) return acc;
    acc[cardId] = (acc[cardId] || 0) + getSubscriptionAmount(subscription);
    return acc;
  }, {});
}
function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    return ["true", "1", "sim", "s", "yes"].includes(normalizedValue);
  }
  return Boolean(value);
}
function getCardId(card) {
  return Number(card?.id ?? card?.Id);
}
function getCardName(card) {
  return card?.name ?? card?.Nome ?? "";
}
function getFixedBillCategory(bill) {
  const category = bill?.category ?? bill?.Categoria ?? bill?.categoria ?? "";
  return category === "Conta fixa" ? "" : category;
}
function normalizeId(value) {
  const numericId = Number(value);
  return Number.isFinite(numericId) ? numericId : value;
}
function getCardBaseChargeMonthKey(item) {
  return normalizeMonthKey(
    item?.monthKey ??
      item?.MonthKey ??
      item?.mesReferencia ??
      item?.MesReferencia ??
      item?.mes_referencia,
  );
}
function getCardBaseChargeCardId(item) {
  return Number(
    item?.cardId ?? item?.CardId ?? item?.idCartao ?? item?.IdCartao,
  );
}
function getCardBaseChargeAmount(item) {
  return parseApiMoney(
    item?.amount ?? item?.Amount ?? item?.valor ?? item?.Valor,
  );
}
function normalizeCardBaseCharge(item) {
  return {
    id: normalizeId(item?.id ?? item?.Id),
    cardId: getCardBaseChargeCardId(item),
    monthKey: getCardBaseChargeMonthKey(item),
    description:
      item?.description ??
      item?.Description ??
      item?.descricao ??
      item?.Descricao ??
      "Parcelas em andamento",
    amount: getCardBaseChargeAmount(item),
  };
}
function getFixedBillAmount(bill) {
  return parseApiMoney(
    bill?.amount ?? bill?.Amount ?? bill?.valor ?? bill?.Valor,
  );
}
function normalizeFixedBill(bill) {
  return {
    id: normalizeId(bill?.id ?? bill?.Id),
    name: bill?.name ?? bill?.Nome ?? bill?.nome ?? "",
    amount: getFixedBillAmount(bill),
    dueDay: Number(bill?.dueDay ?? bill?.DiaVencimento ?? bill?.diaVencimento),
    paid: toBoolean(bill?.paid ?? bill?.Pago ?? bill?.pago),
    category: getFixedBillCategory(bill),
  };
}
function getSubscriptionCardId(subscription) {
  return Number(
    subscription?.cardId ??
      subscription?.CardId ??
      subscription?.idCartao ??
      subscription?.IdCartao,
  );
}
function getSubscriptionAmount(subscription) {
  return parseApiMoney(
    subscription?.amount ??
      subscription?.Amount ??
      subscription?.valor ??
      subscription?.Valor,
  );
}
function getSubscriptionInInvoice(subscription) {
  return toBoolean(
    subscription?.inInvoice ??
      subscription?.InInvoice ??
      subscription?.entraNaFatura ??
      subscription?.EntraNaFatura,
  );
}
function normalizeSubscription(subscription) {
  const cardId = getSubscriptionCardId(subscription);

  return {
    id: normalizeId(subscription?.id ?? subscription?.Id),
    name: subscription?.name ?? subscription?.Nome ?? subscription?.nome ?? "",
    amount: getSubscriptionAmount(subscription),
    chargeDay: Number(
      subscription?.chargeDay ??
        subscription?.DiaCobranca ??
        subscription?.diaCobranca,
    ),
    cardId: Number.isFinite(cardId) && cardId > 0 ? cardId : null,
    category:
      subscription?.category ??
      subscription?.Categoria ??
      subscription?.categoria ??
      "Streaming",
    inInvoice: getSubscriptionInInvoice(subscription),
  };
}
function getHistoryCardId(item) {
  return Number(
    item?.cardId ?? item?.CardId ?? item?.idCartao ?? item?.IdCartao,
  );
}
function getHistoryAmount(item) {
  return parseApiMoney(
    item?.amount ?? item?.Amount ?? item?.valor ?? item?.Valor,
  );
}
function normalizeHistoryItem(item, cards = []) {
  const cardId = getHistoryCardId(item);
  const linkedCard = cards.find((card) => getCardId(card) === cardId);
  const date = formatApiDateText(
    item?.date ??
      item?.Date ??
      item?.data ??
      item?.Data ??
      item?.dataHora ??
      item?.DataHora,
  );
  const billingMonth = getHistoryBillingMonthKey(item);

  return {
    id: normalizeId(item?.id ?? item?.Id ?? item?.idGasto ?? item?.IdGasto),
    cardId: Number.isFinite(cardId) && cardId > 0 ? cardId : null,
    cardName:
      item?.cardName ??
      item?.CardName ??
      item?.nomeCartao ??
      item?.NomeCartao ??
      item?.cartaoNome ??
      item?.CartaoNome ??
      item?.cartao?.name ??
      item?.cartao?.Nome ??
      item?.Cartao?.Nome ??
      getCardName(linkedCard),
    description:
      item?.description ??
      item?.Description ??
      item?.descricao ??
      item?.Descricao ??
      "Gasto Mês",
    date,
    amount: getHistoryAmount(item),
    before: parseApiMoney(
      item?.before ?? item?.Before ?? item?.antes ?? item?.Antes,
    ),
    after: parseApiMoney(
      item?.after ?? item?.After ?? item?.depois ?? item?.Depois,
    ),
    ...(billingMonth ? { mesReferencia: billingMonth } : {}),
  };
}
function normalizeDashboardPayload(
  data = {},
  requestedMonth = getCurrentMonthKey(),
) {
  const monthKey =
    normalizeMonthKey(
      data.monthKey ??
        data.MonthKey ??
        data.mesReferencia ??
        data.MesReferencia ??
        requestedMonth,
    ) || requestedMonth;
  const cards = (data.cards || data.cartoes || []).map((card) => ({
    id: Number(card.id ?? card.Id),
    name: card.name ?? card.Nome ?? card.nome,
    closeDay: card.closeDay ?? card.DiaFechamento ?? card.diaFechamento ?? null,
    dueDay: card.dueDay ?? card.DiaVencimento ?? card.diaVencimento,
    paid: toBoolean(card.paid ?? card.Pago ?? card.pago),
    tone: card.tone ?? card.CorClasse ?? card.corClasse,
  }));
  const rawCardBaseCharges =
    data.cardBaseCharges || data.cartaoBaseParcelas || data.baseParcelas || [];
  const billingMonthOptions = getBillingMonthOptions(data);

  return {
    monthKey,
    salaryInput: formatApiMoneyInput(getSalaryFromDashboardData(data)),
    cards,
    cardBaseCharges: rawCardBaseCharges.map(normalizeCardBaseCharge),
    fixedBills: (data.fixedBills || data.contasFixas || []).map(
      normalizeFixedBill,
    ),
    subscriptions: (data.subscriptions || data.recorrentes || []).map(
      normalizeSubscription,
    ),
    history: (data.history || data.historico || []).map((item) =>
      normalizeHistoryItem(item, cards),
    ),
    billingMonthOptions:
      billingMonthOptions.length > 0 ? billingMonthOptions : [monthKey],
  };
}
const subscriptionIconMatches = [
  {
    terms: ["youtube music", "youtube musica", "you tube music"],
    icon: SiYoutubemusic,
    className: "text-red-600",
  },
  {
    terms: ["youtube", "you tube"],
    icon: SiYoutube,
    className: "text-red-600",
  },
  {
    terms: ["apple music"],
    icon: SiApplemusic,
    className: "text-rose-500",
  },
  {
    terms: ["apple tv", "appletv"],
    icon: SiAppletv,
    className: "text-slate-800",
  },
  {
    terms: ["apple podcasts", "apple podcast"],
    icon: SiApplepodcasts,
    className: "text-purple-600",
  },
  {
    terms: ["apple pay", "applepay"],
    icon: SiApplepay,
    className: "text-slate-800",
  },
  {
    terms: ["icloud", "apple"],
    icon: SiApple,
    className: "text-slate-700",
  },
  {
    terms: ["spotify"],
    icon: SiSpotify,
    className: "text-emerald-500",
  },
  {
    terms: ["discord"],
    icon: SiDiscord,
    className: "text-indigo-500",
  },
  {
    terms: ["netflix"],
    icon: SiNetflix,
    className: "text-red-700",
  },
  {
    terms: ["hbo max", "hbomax"],
    icon: SiHbomax,
    className: "text-violet-600",
  },
  {
    terms: ["max"],
    icon: SiMax,
    className: "text-blue-600",
  },
  {
    terms: ["paramount", "paramount plus"],
    icon: SiParamountplus,
    className: "text-blue-600",
  },
  {
    terms: ["crunchyroll"],
    icon: SiCrunchyroll,
    className: "text-orange-500",
  },
  {
    terms: ["dazn"],
    icon: SiDazn,
    className: "text-lime-600",
  },
  {
    terms: ["twitch"],
    icon: SiTwitch,
    className: "text-violet-600",
  },
  {
    terms: ["steam"],
    icon: SiSteam,
    className: "text-slate-800",
  },
  {
    terms: ["tidal"],
    icon: SiTidal,
    className: "text-slate-800",
  },
  {
    terms: ["soundcloud", "sound cloud"],
    icon: SiSoundcloud,
    className: "text-orange-500",
  },
  {
    terms: ["pandora"],
    icon: SiPandora,
    className: "text-blue-600",
  },
  {
    terms: ["audible"],
    icon: SiAudible,
    className: "text-orange-500",
  },
  {
    terms: ["pocket casts", "pocketcasts"],
    icon: SiPocketcasts,
    className: "text-red-600",
  },
  {
    terms: ["vimeo"],
    icon: SiVimeo,
    className: "text-sky-500",
  },
  {
    terms: ["dailymotion", "daily motion"],
    icon: SiDailymotion,
    className: "text-blue-600",
  },
  {
    terms: ["plex"],
    icon: SiPlex,
    className: "text-amber-500",
  },
  {
    terms: ["roku"],
    icon: SiRoku,
    className: "text-violet-600",
  },
  {
    terms: ["whatsapp", "whats app"],
    icon: SiWhatsapp,
    className: "text-emerald-500",
  },
  {
    terms: ["telegram"],
    icon: SiTelegram,
    className: "text-sky-500",
  },
  {
    terms: ["instagram"],
    icon: SiInstagram,
    className: "text-pink-600",
  },
  {
    terms: ["facebook"],
    icon: SiFacebook,
    className: "text-blue-600",
  },
  {
    terms: ["tiktok", "tik tok"],
    icon: SiTiktok,
    className: "text-slate-800",
  },
  {
    terms: ["snapchat", "snap chat"],
    icon: SiSnapchat,
    className: "text-yellow-500",
  },
  {
    terms: ["twitter", "x"],
    icon: SiX,
    className: "text-slate-800",
  },
  {
    terms: ["reddit"],
    icon: SiReddit,
    className: "text-orange-600",
  },
  {
    terms: ["pinterest"],
    icon: SiPinterest,
    className: "text-red-600",
  },
  {
    terms: ["slack"],
    icon: SiSlack,
    className: "text-violet-600",
  },
  {
    terms: ["zoom"],
    icon: SiZoom,
    className: "text-blue-600",
  },
  {
    terms: ["notion"],
    icon: SiNotion,
    className: "text-slate-800",
  },
  {
    terms: ["figma"],
    icon: SiFigma,
    className: "text-slate-800",
  },
  {
    terms: ["canva"],
    icon: SiCanva,
    className: "text-cyan-600",
  },
  {
    terms: ["github"],
    icon: SiGithub,
    className: "text-slate-800",
  },
  {
    terms: ["gitlab"],
    icon: SiGitlab,
    className: "text-orange-600",
  },
  {
    terms: ["dropbox"],
    icon: SiDropbox,
    className: "text-blue-600",
  },
  {
    terms: ["google drive", "googledrive"],
    icon: SiGoogledrive,
    className: "text-emerald-600",
  },
  {
    terms: ["google meet", "googlemeet"],
    icon: SiGooglemeet,
    className: "text-emerald-600",
  },
  {
    terms: ["google calendar", "google agenda", "googlecalendar"],
    icon: SiGooglecalendar,
    className: "text-blue-600",
  },
  {
    terms: ["google play", "googleplay"],
    icon: SiGoogleplay,
    className: "text-emerald-600",
  },
  {
    terms: ["google tv", "googletv"],
    icon: SiGoogletv,
    className: "text-blue-600",
  },
  {
    terms: ["google gemini", "googlegemini", "gemini", "gemini ai"],
    icon: SiGooglegemini,
    className: "text-blue-600",
  },
  {
    terms: ["google"],
    icon: SiGoogle,
    className: "text-blue-600",
  },
  {
    terms: ["claude", "claude ai"],
    icon: SiClaude,
    className: "text-orange-600",
  },
  {
    terms: ["anthropic"],
    icon: SiAnthropic,
    className: "text-orange-600",
  },
  {
    terms: ["openai", "chatgpt"],
    icon: SiOpenai,
    className: "text-slate-800",
  },
  {
    terms: ["trello"],
    icon: SiTrello,
    className: "text-blue-600",
  },
  {
    terms: ["jira"],
    icon: SiJira,
    className: "text-blue-600",
  },
  {
    terms: ["atlassian"],
    icon: SiAtlassian,
    className: "text-blue-600",
  },
  {
    terms: ["asana"],
    icon: SiAsana,
    className: "text-rose-600",
  },
  {
    terms: ["todoist"],
    icon: SiTodoist,
    className: "text-red-600",
  },
  {
    terms: ["clickup", "click up"],
    icon: SiClickup,
    className: "text-violet-600",
  },
  {
    terms: ["airtable"],
    icon: SiAirtable,
    className: "text-orange-500",
  },
  {
    terms: ["miro"],
    icon: SiMiro,
    className: "text-yellow-600",
  },
  {
    terms: ["linear"],
    icon: SiLinear,
    className: "text-indigo-600",
  },
  {
    terms: ["zapier"],
    icon: SiZapier,
    className: "text-orange-500",
  },
  {
    terms: ["mailchimp", "mail chimp"],
    icon: SiMailchimp,
    className: "text-yellow-600",
  },
  {
    terms: ["hubspot", "hub spot"],
    icon: SiHubspot,
    className: "text-orange-500",
  },
  {
    terms: ["salesforce"],
    icon: SiSalesforce,
    className: "text-sky-500",
  },
  {
    terms: ["zendesk"],
    icon: SiZendesk,
    className: "text-emerald-700",
  },
  {
    terms: ["shopify"],
    icon: SiShopify,
    className: "text-emerald-600",
  },
  {
    terms: ["woocommerce", "woo commerce"],
    icon: SiWoocommerce,
    className: "text-purple-600",
  },
  {
    terms: ["wordpress", "word press"],
    icon: SiWordpress,
    className: "text-blue-700",
  },
  {
    terms: ["wix"],
    icon: SiWix,
    className: "text-slate-800",
  },
  {
    terms: ["squarespace", "square space"],
    icon: SiSquarespace,
    className: "text-slate-800",
  },
  {
    terms: ["nubank", "nu bank"],
    icon: SiNubank,
    className: "text-purple-700",
  },
  {
    terms: ["picpay", "pic pay"],
    icon: SiPicpay,
    className: "text-emerald-500",
  },
  {
    terms: ["mercado pago", "mercadopago"],
    icon: SiMercadopago,
    className: "text-sky-500",
  },
  {
    terms: ["paypal", "pay pal"],
    icon: SiPaypal,
    className: "text-blue-700",
  },
  {
    terms: ["pix"],
    icon: SiPix,
    className: "text-teal-600",
  },
  {
    terms: ["visa"],
    icon: SiVisa,
    className: "text-blue-700",
  },
  {
    terms: ["mastercard", "master card"],
    icon: SiMastercard,
    className: "text-red-600",
  },
  {
    terms: ["american express", "amex"],
    icon: SiAmericanexpress,
    className: "text-blue-700",
  },
  {
    terms: ["stripe"],
    icon: SiStripe,
    className: "text-violet-600",
  },
  {
    terms: ["wise"],
    icon: SiWise,
    className: "text-emerald-600",
  },
  {
    terms: ["zelle"],
    icon: SiZelle,
    className: "text-purple-700",
  },
  {
    terms: ["venmo"],
    icon: SiVenmo,
    className: "text-blue-600",
  },
  {
    terms: ["cash app", "cashapp"],
    icon: SiCashapp,
    className: "text-emerald-500",
  },
  {
    terms: ["binance"],
    icon: SiBinance,
    className: "text-yellow-600",
  },
  {
    terms: ["bitcoin", "btc"],
    icon: SiBitcoin,
    className: "text-orange-500",
  },
  {
    terms: ["n26"],
    icon: SiN26,
    className: "text-cyan-700",
  },
  {
    terms: ["revolut"],
    icon: SiRevolut,
    className: "text-blue-600",
  },
  {
    terms: ["monzo"],
    icon: SiMonzo,
    className: "text-orange-600",
  },
  {
    terms: ["ifood"],
    icon: SiIfood,
    className: "text-red-600",
  },
  {
    terms: ["uber eats", "ubereats"],
    icon: SiUbereats,
    className: "text-emerald-600",
  },
  {
    terms: ["uber"],
    icon: SiUber,
    className: "text-slate-800",
  },
  {
    terms: ["airbnb", "air bnb"],
    icon: SiAirbnb,
    className: "text-rose-600",
  },
  {
    terms: ["booking", "booking.com"],
    icon: SiBookingdotcom,
    className: "text-blue-700",
  },
  {
    terms: ["shopee"],
    icon: SiShopee,
    className: "text-orange-600",
  },
  {
    terms: ["aliexpress", "ali express"],
    icon: SiAliexpress,
    className: "text-red-600",
  },
  {
    terms: ["walmart"],
    icon: SiWalmart,
    className: "text-blue-600",
  },
  {
    terms: ["playstation", "play station", "psn"],
    icon: SiPlaystation,
    className: "text-blue-700",
  },
  {
    terms: ["riot games", "riot"],
    icon: SiRiotgames,
    className: "text-red-600",
  },
  {
    terms: ["epic games", "epic"],
    icon: SiEpicgames,
    className: "text-slate-800",
  },
  {
    terms: ["samsung"],
    icon: SiSamsung,
    className: "text-blue-700",
  },
  {
    terms: ["vivo"],
    icon: SiVivo,
    className: "text-purple-700",
  },
  {
    terms: ["coursera"],
    icon: SiCoursera,
    className: "text-blue-600",
  },
  {
    terms: ["udemy"],
    icon: SiUdemy,
    className: "text-violet-600",
  },
  {
    terms: ["duolingo"],
    icon: SiDuolingo,
    className: "text-emerald-600",
  },
  {
    terms: ["khan academy", "khanacademy"],
    icon: SiKhanacademy,
    className: "text-emerald-600",
  },
  {
    terms: ["medium"],
    icon: SiMedium,
    className: "text-slate-800",
  },
  {
    terms: ["substack", "sub stack"],
    icon: SiSubstack,
    className: "text-orange-600",
  },
  {
    terms: ["patreon"],
    icon: SiPatreon,
    className: "text-orange-600",
  },
  {
    terms: ["onlyfans", "only fans"],
    icon: SiOnlyfans,
    className: "text-sky-500",
  },
  {
    terms: ["fiverr"],
    icon: SiFiverr,
    className: "text-emerald-600",
  },
  {
    terms: ["upwork", "up work"],
    icon: SiUpwork,
    className: "text-emerald-600",
  },
];
function normalizeSubscriptionName(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
function getSubscriptionIconConfig(name) {
  const normalizedName = normalizeSubscriptionName(name);
  const match = subscriptionIconMatches.find(({ terms }) =>
    terms.some((term) => normalizedName.includes(term)),
  );

  return (
    match || {
      icon: Repeat,
      className: "text-slate-500",
    }
  );
}
function getHistorySortKey(item) {
  const parsedDate = parseDateValue(item.date);
  return parsedDate ? parsedDate.getTime() : Number.POSITIVE_INFINITY;
}
function sortHistoryItemsByDate(items) {
  return [...items].sort((a, b) => {
    const dateDiff = getHistorySortKey(a) - getHistorySortKey(b);
    if (dateDiff !== 0) return dateDiff;
    return String(a.id).localeCompare(String(b.id));
  });
}
function buildHistoryRowsForMonth(
  history,
  monthKey,
  cards,
  cardBaseCharges,
  recurringTotalsByCard,
) {
  const monthItems = history.filter(
    (item) => getHistoryMonthKey(item) === monthKey,
  );
  const baseTotalsByCard = calculateBaseTotalsByCard(cardBaseCharges, monthKey);
  const runningTotalsByCardName = cards.reduce((acc, card) => {
    acc[card.name] =
      (baseTotalsByCard[card.id] || 0) + (recurringTotalsByCard[card.id] || 0);
    return acc;
  }, {});
  const rowsById = new Map();
  const sortedMonthItems = sortHistoryItemsByDate(monthItems);
  sortedMonthItems.forEach((item) => {
    const before = runningTotalsByCardName[item.cardName] || 0;
    const amount = getHistoryAmount(item);
    const after = before + amount;
    runningTotalsByCardName[item.cardName] = after;
    rowsById.set(item.id, {
      ...item,
      amount,
      before: Number(before.toFixed(2)),
      after: Number(after.toFixed(2)),
    });
  });
  return sortedMonthItems.map((item) => rowsById.get(item.id) || item);
}
function buildExpenseDateHistoryRowsForMonth(history, monthKey) {
  return sortHistoryItemsByDate(
    history.filter((item) => getHistoryExpenseMonthKey(item) === monthKey),
  );
}
function getCardColorStyles(cardName) {
  switch (cardName) {
    case "Nubank":
      return {
        summary: "bg-purple-50 border-purple-200",
        title: "text-purple-700",
        badge: "bg-purple-100 text-purple-700",
      };
    case "Santander":
      return {
        summary: "bg-red-50 border-red-200",
        title: "text-red-700",
        badge: "bg-red-100 text-red-700",
      };
    case "Inter":
      return {
        summary: "bg-orange-50 border-orange-200",
        title: "text-orange-700",
        badge: "bg-orange-100 text-orange-700",
      };
    default:
      return {
        summary: "bg-slate-50 border-slate-200",
        title: "text-slate-700",
        badge: "bg-slate-100 text-slate-700",
      };
  }
}
function buildCalendarItems(cards, subscriptions, fixedBills) {
  return [
    ...cards
      .filter((card) => card.closeDay)
      .map((card) => ({
        day: card.closeDay,
        label: `Dia ${card.closeDay} - Fecha ${card.name}`,
      })),
    ...subscriptions.map((subscription) => {
      const linkedCard = cards.find((card) => card.id === subscription.cardId);
      return {
        day: subscription.chargeDay,
        label: `Dia ${subscription.chargeDay} - ${subscription.name}${linkedCard ? ` no ${linkedCard.name}` : " fora da fatura"}`,
      };
    }),
    ...cards.map((card) => ({
      day: card.dueDay,
      label: `Dia ${card.dueDay} - Vence ${card.name}`,
    })),
    ...fixedBills.map((bill) => ({
      day: bill.dueDay,
      label: `Dia ${bill.dueDay} - Vence ${bill.name}`,
    })),
  ]
    .filter((item) => Number.isFinite(item.day))
    .sort((a, b) => a.day - b.day)
    .map((item) => item.label);
}
function runSelfTests() {
  const recurringTotals = calculateRecurringTotalsByCard(initialSubscriptions);
  const baseTotals = calculateBaseTotalsByCard(
    initialCardBaseCharges,
    "2026-06",
  );
  const variableTotals = calculateVariableTotalsByCard(
    initialHistory,
    "2026-05",
  );
  console.assert(
    Math.abs(recurringTotals[1] - 70.8) < 0.001,
    "Nubank deve somar R$ 70,80 em recorrentes.",
  );
  console.assert(
    !recurringTotals[2],
    "Santander não deve iniciar com recorrentes.",
  );
  console.assert(
    Math.abs(baseTotals[1] - 451.74) < 0.001,
    "Nubank deve iniciar com R$ 451,74 em base/parcelas.",
  );
  console.assert(
    !calculateBaseTotalsByCard(initialCardBaseCharges, "2026-07")[1],
    "Julho deve iniciar sem base cadastrada.",
  );
  console.assert(
    Math.abs(variableTotals.Nubank - 127.82) < 0.001,
    "Maio deve somar apenas Gastos Mês do histórico.",
  );
  console.assert(
    parseMoney("50,25") === 50.25,
    "parseMoney deve aceitar vírgula decimal.",
  );
  console.assert(
    parseMoney("1.250,99") === 1250.99,
    "parseMoney deve aceitar formato pt-BR com milhar.",
  );
  console.assert(
    parseMoney("1.900,00") === 1900,
    "parseMoney deve aceitar salário em formato pt-BR.",
  );
  console.assert(
    parseMoney("R$ 1.995,00") === 1995,
    "parseMoney deve aceitar salário com símbolo de moeda.",
  );
  console.assert(
    getPreviousMonthKey("2026-08") === "2026-07",
    "Agosto deve copiar salário de julho.",
  );
  console.assert(
    getPreviousMonthKey("2026-01") === "2025-12",
    "Janeiro deve copiar salário de dezembro do ano anterior.",
  );
  console.assert(
    parseApiMoney("1900.5") === 1900.5,
    "parseApiMoney deve aceitar decimal retornado pela API.",
  );
  console.assert(
    parseApiMoney("1.900,00") === 1900,
    "parseApiMoney deve aceitar valor em formato pt-BR.",
  );
  console.assert(
    getSalaryFromDashboardData({ salario: "1.900,00" }) === 1900,
    "Dashboard deve ler salário em formato pt-BR.",
  );
  console.assert(
    formatMoneyInput("1995") === "1.995,00",
    "formatMoneyInput deve formatar salário sem pontuação.",
  );
  console.assert(
    formatMoneyTyping("1") === "0,01",
    "formatMoneyTyping deve tratar o primeiro dígito como centavo.",
  );
  console.assert(
    formatMoneyTyping("1234") === "12,34",
    "formatMoneyTyping deve inserir vírgula automaticamente.",
  );
  console.assert(
    formatMoneyTyping("123456") === "1.234,56",
    "formatMoneyTyping deve inserir separador de milhar.",
  );
  console.assert(
    getMonthKeyFromDateText("01/06/2026, 12:01:44") === "2026-06",
    "Histórico deve aceitar data com vírgula.",
  );
  console.assert(
    getMonthKeyFromDateText("04/05/2026 18:34:21") === "2026-05",
    "Histórico deve gerar chave mensal.",
  );
  console.assert(
    getMonthKeyFromDateText("2026-07-01T10:00:00") === "2026-07",
    "Histórico deve aceitar data ISO retornada pela API.",
  );
  console.assert(
    parseBrazilianDate("31/02/2026 12:00:00") === null,
    "Data inválida não deve ser normalizada.",
  );
  console.assert(
    !getMonthOptionsFromHistory(initialHistory).includes("2026-06"),
    "Histórico não deve listar meses sem lançamentos.",
  );
  console.assert(
    getMonthOptionsFromHistory(
      [
        {
          date: "20/06/2026 12:00:00",
          amount: 10,
          mesReferencia: "2026-07",
        },
      ],
      HISTORY_VIEW_BY_BILLING,
    ).join(",") === "2026-07",
    "Visão por fatura deve listar o mês da cobrança.",
  );
  console.assert(
    getMonthOptionsFromHistory(
      [
        {
          date: "20/06/2026 12:00:00",
          amount: 10,
          mesReferencia: "2026-07",
        },
      ],
      HISTORY_VIEW_BY_EXPENSE_DATE,
    ).join(",") === "2026-06",
    "Visão por data deve listar o mês do gasto.",
  );
  console.assert(
    calculateVariableTotalsByCard(
      [
        {
          cardName: "Nubank",
          date: "01/06/2026 12:00:00",
          amount: 10,
          mesReferencia: "2026-07",
        },
      ],
      "2026-07",
    ).Nubank === 10,
    "Gasto deve somar na fatura informada pela API.",
  );
  console.assert(
    !calculateVariableTotalsByCard(
      [
        {
          cardName: "Nubank",
          date: "01/06/2026 12:00:00",
          amount: 10,
          mesReferencia: "2026-07",
        },
      ],
      "2026-06",
    ).Nubank,
    "Data do gasto não deve sobrescrever a fatura informada pela API.",
  );
  console.assert(
    calculateBaseTotalsByCard(
      [{ IdCartao: 1, MesReferencia: "2026-07", Valor: "10,50" }],
      "2026-07",
    )[1] === 10.5,
    "Base/parcelas deve aceitar campos da API em português.",
  );
  console.assert(
    calculateRecurringTotalsByCard([
      { IdCartao: 2, Valor: "20,00", EntraNaFatura: true },
    ])[2] === 20,
    "Recorrentes devem aceitar campos da API em português.",
  );
  console.assert(
    getBillingMonthOptions(["2026-08", "2026-08", "sem-data"]).join(",") ===
      "2026-08",
    "Fatura deve listar apenas meses válidos retornados pela API.",
  );
  console.assert(
    getBillingMonthOptions({
      mesesFinanceiros: [{ mesReferencia: "2026-07" }, { monthKey: "2026-08" }],
    }).join(",") === "2026-08,2026-07",
    "Fatura deve aceitar meses retornados como objetos da API.",
  );
  console.assert(
    getCardColorStyles("Santander").title === "text-red-700",
    "Santander deve usar estilo vermelho.",
  );
  console.assert(
    buildCalendarItems(
      initialCards,
      initialSubscriptions,
      initialFixedBills,
    )[0] === "Dia 2 - Fecha Nubank",
    "Calendário deve ser ordenado pelo dia.",
  );
}
runSelfTests();
function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p
            className={`mt-2 text-2xl font-bold ${accent || "text-slate-900"}`}
          >
            {value}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
function MoneyInput({
  id,
  value,
  onChange,
  onCommit,
  placeholder = "0,00",
  className = "",
  ringClassName = "ring-slate-300",
}) {
  const [isFocused, setIsFocused] = useState(false);
  function handleChange(event) {
    onChange(formatMoneyTyping(event.target.value));
  }
  function handleBlur() {
    if (!String(value || "").trim()) {
      setIsFocused(false);
      onChange("");
      return;
    }
    const formattedValue = formatMoneyInput(value);
    setIsFocused(false);
    onChange(formattedValue);
    if (onCommit) {
      onCommit(formattedValue);
    }
  }
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 ${ringClassName} transition focus-within:ring-2 ${className}`}
    >
      <span className="shrink-0 font-bold text-slate-500">R$</span>
      <input
        id={id}
        value={value}
        inputMode="decimal"
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={isFocused ? "" : placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
function App() {
  const [editingSubscriptionId, setEditingSubscriptionId] = useState(null);
  const [subscriptionDraft, setSubscriptionDraft] = useState({
    name: "",
    amount: "0,00",
    chargeDay: "",
    category: "Streaming",
  });
  const [newFixedBill, setNewFixedBill] = useState({
    name: "",
    category: "",
    amount: "0,00",
    dueDay: "",
  });
  const [editingFixedBillId, setEditingFixedBillId] = useState(null);
  const [fixedBillDraft, setFixedBillDraft] = useState({
    name: "",
    category: "",
    amount: "0,00",
    dueDay: "",
  });

  const [newBillingMonth, setNewBillingMonth] = useState("");
  const [apiBillingMonthOptions, setApiBillingMonthOptions] = useState([]);

  const [cards, setCards] = useState([]);
  const [fixedBills, setFixedBills] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [cardBaseCharges, setCardBaseCharges] = useState([]);
  const [baseChargeInputs, setBaseChargeInputs] = useState({});
  const [savingBaseChargeCardId, setSavingBaseChargeCardId] = useState(null);
  const [selectedBillingMonth, setSelectedBillingMonth] = useState(() =>
    getInitialBillingMonth(),
  );
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState(() =>
    getInitialBillingMonth(),
  );
  const [selectedHistoryView, setSelectedHistoryView] = useState(
    HISTORY_VIEW_BY_BILLING,
  );
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  const [historyDraft, setHistoryDraft] = useState({
    dateInput: "",
    cardName: "",
    description: "",
    amount: "",
  });
  const [expense, setExpense] = useState({
    cardId: 1,
    description: "",
    amount: "",
    dateInput: getCurrentDateTimeLocal(),
  });
  const [newSubscription, setNewSubscription] = useState({
    name: "",
    amount: "",
    chargeDay: "",
    cardId: 1,
    category: "Streaming",
    inInvoice: true,
  });
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [error, setError] = useState("");
  const [salaryInput, setSalaryInput] = useState("1.900,00");
  const parsedSalary = parseMoney(salaryInput);
  const salary = Number.isFinite(parsedSalary) ? parsedSalary : 0;
  const dashboardRequestsRef = useRef(new Map());
  const dashboardCacheRef = useRef(new Map());
  const latestBillingMonthOptionsRef = useRef([]);
  const latestDashboardRequestIdRef = useRef(0);
  const lastAppliedDashboardMonthRef = useRef("");

  const applyDashboardData = useCallback((dashboardData, options = {}) => {
    const latestBillingMonthOptions = latestBillingMonthOptionsRef.current;
    const nextBillingMonthOptions =
      options.fromCache && latestBillingMonthOptions.length > 0
        ? latestBillingMonthOptions
        : dashboardData.billingMonthOptions;

    setCards(dashboardData.cards);
    setCardBaseCharges(dashboardData.cardBaseCharges);
    setFixedBills(dashboardData.fixedBills);
    setSubscriptions(dashboardData.subscriptions);
    setHistory(dashboardData.history);
    setApiBillingMonthOptions(nextBillingMonthOptions);
    setSalaryInput(dashboardData.salaryInput);
    latestBillingMonthOptionsRef.current = nextBillingMonthOptions;
    lastAppliedDashboardMonthRef.current = dashboardData.monthKey;
  }, []);

  const rememberBillingMonthOption = useCallback((monthKey) => {
    const normalizedMonth = normalizeMonthKey(monthKey);
    if (!normalizedMonth) return;

    const nextBillingMonthOptions = getBillingMonthOptions([
      ...latestBillingMonthOptionsRef.current,
      normalizedMonth,
    ]);

    latestBillingMonthOptionsRef.current = nextBillingMonthOptions;
    setApiBillingMonthOptions(nextBillingMonthOptions);
  }, []);

  const invalidateDashboardMonth = useCallback((monthKey) => {
    const normalizedMonth = normalizeMonthKey(monthKey);
    if (!normalizedMonth) return;

    dashboardCacheRef.current.delete(normalizedMonth);
  }, []);

  const loadDashboard = useCallback(
    async (monthKey, options = {}) => {
      const requestedMonth =
        normalizeMonthKey(monthKey) || getCurrentMonthKey();
      const forceRefresh = options.forceRefresh === true;

      if (!forceRefresh) {
        const cachedDashboard = dashboardCacheRef.current.get(requestedMonth);
        if (cachedDashboard) {
          setError("");
          applyDashboardData(cachedDashboard, { fromCache: true });
          return cachedDashboard;
        }

        const currentRequest = dashboardRequestsRef.current.get(requestedMonth);
        if (currentRequest) {
          return currentRequest;
        }
      }

      const requestId = latestDashboardRequestIdRef.current + 1;
      latestDashboardRequestIdRef.current = requestId;

      const requestPromise = (async () => {
        try {
          setDashboardLoading(true);
          setError("");

          const data = await fetchDashboardData(requestedMonth);
          const dashboardData = normalizeDashboardPayload(data, requestedMonth);

          dashboardCacheRef.current.set(dashboardData.monthKey, dashboardData);
          if (dashboardData.monthKey !== requestedMonth) {
            dashboardCacheRef.current.set(requestedMonth, dashboardData);
          }

          if (requestId !== latestDashboardRequestIdRef.current) {
            return dashboardData;
          }

          applyDashboardData(dashboardData);
          return dashboardData;
        } catch (err) {
          if (requestId === latestDashboardRequestIdRef.current) {
            console.error(err);
            setError(err.message || "Erro inesperado ao carregar dashboard.");
          }
          return null;
        } finally {
          if (
            dashboardRequestsRef.current.get(requestedMonth) === requestPromise
          ) {
            dashboardRequestsRef.current.delete(requestedMonth);
          }
          if (requestId === latestDashboardRequestIdRef.current) {
            setDashboardLoading(false);
          }
        }
      })();

      dashboardRequestsRef.current.set(requestedMonth, requestPromise);
      return requestPromise;
    },
    [applyDashboardData],
  );

  const refreshDashboardMonth = useCallback(
    (monthKey) => {
      const requestedMonth =
        normalizeMonthKey(monthKey) || getCurrentMonthKey();
      invalidateDashboardMonth(requestedMonth);
      return loadDashboard(requestedMonth, { forceRefresh: true });
    },
    [invalidateDashboardMonth, loadDashboard],
  );
  const recurringTotalsByCard = useMemo(
    () => calculateRecurringTotalsByCard(subscriptions),
    [subscriptions],
  );
  const isHistoryByBillingMonth =
    selectedHistoryView === HISTORY_VIEW_BY_BILLING;
  const historyMonthOptions = useMemo(
    () => getMonthOptionsFromHistory(history, selectedHistoryView),
    [history, selectedHistoryView],
  );

  const billingMonthOptions = useMemo(() => {
    const apiMonths = getBillingMonthOptions(apiBillingMonthOptions);

    return apiMonths.length > 0 ? apiMonths : [selectedBillingMonth];
  }, [apiBillingMonthOptions, selectedBillingMonth]);

  const activeHistoryMonth =
    historyMonthOptions.length > 0 &&
    !historyMonthOptions.includes(selectedHistoryMonth)
      ? getDefaultHistoryMonth(history, selectedHistoryView)
      : selectedHistoryMonth;
  const activeBillingMonth = billingMonthOptions.includes(selectedBillingMonth)
    ? selectedBillingMonth
    : billingMonthOptions[0] || getCurrentMonthKey();
  useEffect(() => {
    saveCachedBillingMonth(activeBillingMonth);
  }, [activeBillingMonth]);
  useEffect(() => {
    if (lastAppliedDashboardMonthRef.current === activeBillingMonth) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      if (lastAppliedDashboardMonthRef.current !== activeBillingMonth) {
        loadDashboard(activeBillingMonth);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [activeBillingMonth, loadDashboard]);
  const filteredHistory = useMemo(
    () =>
      isHistoryByBillingMonth
        ? buildHistoryRowsForMonth(
            history,
            activeHistoryMonth,
            cards,
            cardBaseCharges,
            recurringTotalsByCard,
          )
        : buildExpenseDateHistoryRowsForMonth(history, activeHistoryMonth),
    [
      history,
      activeHistoryMonth,
      isHistoryByBillingMonth,
      cards,
      cardBaseCharges,
      recurringTotalsByCard,
    ],
  );
  const selectedHistoryTotal = useMemo(
    () =>
      filteredHistory.reduce((sum, item) => sum + getHistoryAmount(item), 0),
    [filteredHistory],
  );
  const historyMonthFieldLabel = isHistoryByBillingMonth
    ? "Mês da fatura"
    : "Mês do gasto";
  const historyEmptyMessage = isHistoryByBillingMonth
    ? "Nenhum gasto encontrado para esta fatura."
    : "Nenhum gasto encontrado para este mês.";
  const baseTotalsByCard = useMemo(
    () => calculateBaseTotalsByCard(cardBaseCharges, activeBillingMonth),
    [cardBaseCharges, activeBillingMonth],
  );
  const variableTotalsByCard = useMemo(
    () => calculateVariableTotalsByCard(history, activeBillingMonth),
    [history, activeBillingMonth],
  );
  function getBaseTotal(cardId) {
    return baseTotalsByCard[cardId] || 0;
  }
  function getVariableTotal(cardName) {
    return variableTotalsByCard[cardName] || 0;
  }
  function getRecurringTotal(cardId) {
    return recurringTotalsByCard[cardId] || 0;
  }
  function getCardTotal(card) {
    const cardId = getCardId(card);
    const cardName = getCardName(card);
    return (
      getBaseTotal(cardId) +
      getVariableTotal(cardName) +
      getRecurringTotal(cardId)
    );
  }
  const cardBaseTotal = useMemo(
    () =>
      Object.values(baseTotalsByCard).reduce((sum, amount) => sum + amount, 0),
    [baseTotalsByCard],
  );
  const cardVariableTotal = useMemo(
    () =>
      Object.values(variableTotalsByCard).reduce(
        (sum, amount) => sum + amount,
        0,
      ),
    [variableTotalsByCard],
  );
  const recurringTotal = useMemo(
    () =>
      subscriptions
        .filter((subscription) => getSubscriptionInInvoice(subscription))
        .reduce(
          (sum, subscription) => sum + getSubscriptionAmount(subscription),
          0,
        ),
    [subscriptions],
  );
  const totalOpen = useMemo(() => {
    const openCards = cards
      .filter((card) => !toBoolean(card.paid ?? card.Pago))
      .reduce(
        (sum, card) =>
          sum +
          (baseTotalsByCard[getCardId(card)] || 0) +
          (variableTotalsByCard[getCardName(card)] || 0) +
          (recurringTotalsByCard[getCardId(card)] || 0),
        0,
      );
    const openFixedBills = fixedBills
      .filter((bill) => !toBoolean(bill.paid ?? bill.Pago ?? bill.pago))
      .reduce((sum, bill) => sum + getFixedBillAmount(bill), 0);
    return openCards + openFixedBills;
  }, [
    cards,
    fixedBills,
    baseTotalsByCard,
    variableTotalsByCard,
    recurringTotalsByCard,
  ]);
  const totalPaid = useMemo(() => {
    const paidCards = cards
      .filter((card) => toBoolean(card.paid ?? card.Pago))
      .reduce(
        (sum, card) =>
          sum +
          (baseTotalsByCard[getCardId(card)] || 0) +
          (variableTotalsByCard[getCardName(card)] || 0) +
          (recurringTotalsByCard[getCardId(card)] || 0),
        0,
      );
    const paidFixedBills = fixedBills
      .filter((bill) => toBoolean(bill.paid ?? bill.Pago ?? bill.pago))
      .reduce((sum, bill) => sum + getFixedBillAmount(bill), 0);
    return paidCards + paidFixedBills;
  }, [
    cards,
    fixedBills,
    baseTotalsByCard,
    variableTotalsByCard,
    recurringTotalsByCard,
  ]);
  const monthlyCommitted = totalOpen + totalPaid;
  const monthlyBalance = salary - monthlyCommitted;
  const calendarItems = useMemo(
    () => buildCalendarItems(cards, subscriptions, fixedBills),
    [cards, subscriptions, fixedBills],
  );
  const newSubscriptionIconConfig = getSubscriptionIconConfig(
    newSubscription.name,
  );
  const NewSubscriptionIcon = newSubscriptionIconConfig.icon;
  async function addFixedBill(event) {
    event.preventDefault();
    const numericValue = parseMoney(newFixedBill.amount);
    const numericDueDay = Number(newFixedBill.dueDay);
    if (!newFixedBill.name.trim()) {
      setError("Informe o nome da conta fixa.");
      return;
    }
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      setError("Informe um valor válido.");
      return;
    }
    if (!numericDueDay || numericDueDay < 1 || numericDueDay > 31) {
      setError("Informe um vencimento entre 1 e 31.");
      return;
    }
    const payload = {
      nome: newFixedBill.name.trim(),
      categoria: newFixedBill.category.trim(),
      valor: Number(numericValue.toFixed(2)),
      diaVencimento: numericDueDay,
    };
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/contas-fixas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(responseData?.error || "Erro ao cadastrar conta fixa.");
      }
      setNewFixedBill({
        name: "",
        category: "",
        amount: "0,00",
        dueDay: "",
      });
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao cadastrar conta fixa:", err);
      setError(err.message || "Erro inesperado ao cadastrar conta fixa.");
    } finally {
      setLoading(false);
    }
  }
  function startEditingFixedBill(bill) {
    setEditingFixedBillId(Number(bill.id ?? bill.Id));
    setFixedBillDraft({
      name: bill.name ?? bill.Nome ?? "",
      category: getFixedBillCategory(bill),
      amount: formatMoneyInput(
        String(bill.amount ?? bill.Valor ?? 0).replace(".", ","),
      ),
      dueDay: String(bill.dueDay ?? bill.DiaVencimento ?? ""),
    });
  }
  function cancelEditingFixedBill() {
    setEditingFixedBillId(null);
    setFixedBillDraft({
      name: "",
      category: "",
      amount: "0,00",
      dueDay: "",
    });
  }

  async function copyPreviousSalaryToBillingMonth(monthKey) {
    const previousMonthKey = getPreviousMonthKey(monthKey);
    let previousSalary =
      activeBillingMonth === previousMonthKey ? salary : null;

    try {
      const previousDashboard = await fetchDashboardData(previousMonthKey);
      previousSalary = getSalaryFromDashboardData(previousDashboard);
    } catch (err) {
      console.warn("Erro ao carregar salário do mês anterior:", err);
    }

    if (previousSalary === null) return;
    await saveSalaryForMonth(monthKey, previousSalary);
  }

  async function addBillingMonth() {
    const billingMonthToCreate = newBillingMonth.trim();

    if (!/^\d{4}-\d{2}$/.test(billingMonthToCreate)) {
      setError("Informe um mês de fatura válido.");
      return;
    }

    if (billingMonthOptions.includes(billingMonthToCreate)) {
      setSelectedBillingMonth(billingMonthToCreate);
      setNewBillingMonth("");
      return;
    }

    let salaryCopyError = "";

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/meses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mesReferencia: billingMonthToCreate,
        }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseData?.error || "Erro ao adicionar mês da fatura.",
        );
      }

      try {
        await copyPreviousSalaryToBillingMonth(billingMonthToCreate);
      } catch (err) {
        console.error("Erro ao copiar salário do mês anterior:", err);
        salaryCopyError =
          err.message ||
          "Mês criado, mas não foi possível copiar o salário anterior.";
      }

      rememberBillingMonthOption(billingMonthToCreate);
      invalidateDashboardMonth(billingMonthToCreate);
      setSelectedBillingMonth(billingMonthToCreate);
      setSelectedHistoryMonth(billingMonthToCreate);
      setNewBillingMonth("");

      if (salaryCopyError) {
        setError(salaryCopyError);
      }
    } catch (err) {
      console.error("Erro ao adicionar mês da fatura:", err);
      setError(err.message || "Erro inesperado ao adicionar mês da fatura.");
    } finally {
      setLoading(false);
    }
  }

  async function saveEditingFixedBill(billId) {
    const numericValue = parseMoney(fixedBillDraft.amount);
    const numericDueDay = Number(fixedBillDraft.dueDay);
    if (!fixedBillDraft.name.trim()) {
      setError("Informe o nome da conta fixa.");
      return;
    }
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      setError("Informe um valor válido.");
      return;
    }
    if (!numericDueDay || numericDueDay < 1 || numericDueDay > 31) {
      setError("Informe um vencimento entre 1 e 31.");
      return;
    }
    const payload = {
      nome: fixedBillDraft.name.trim(),
      categoria: fixedBillDraft.category.trim(),
      valor: Number(numericValue.toFixed(2)),
      diaVencimento: numericDueDay,
    };
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/contas-fixas/${billId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(responseData?.error || "Erro ao atualizar conta fixa.");
      }
      cancelEditingFixedBill();
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao atualizar conta fixa:", err);
      setError(err.message || "Erro inesperado ao atualizar conta fixa.");
    } finally {
      setLoading(false);
    }
  }
  async function removeFixedBill(bill) {
    const billId = Number(bill.id ?? bill.Id);
    const billName = bill.name ?? bill.Nome;
    const confirmed = window.confirm(
      `Deseja remover a conta fixa "${billName}"?`,
    );
    if (!confirmed) return;
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/contas-fixas/${billId}`, {
        method: "DELETE",
      });
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(responseData?.error || "Erro ao remover conta fixa.");
      }
      if (editingFixedBillId === billId) {
        cancelEditingFixedBill();
      }
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao remover conta fixa:", err);
      setError(err.message || "Erro inesperado ao remover conta fixa.");
    } finally {
      setLoading(false);
    }
  }
  async function toggleCardPaid(cardId) {
    const selectedCard = cards.find(
      (card) => Number(card.id ?? card.Id) === Number(cardId),
    );
    if (!selectedCard) {
      setError("Cartão não encontrado.");
      return;
    }
    const currentPaid = toBoolean(selectedCard.paid ?? selectedCard.Pago);
    const nextPaid = !currentPaid;
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/cartoes/${cardId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mesReferencia: activeBillingMonth,
          pago: nextPaid,
        }),
      });
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          responseData?.error || "Erro ao atualizar status do cartão.",
        );
      }
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao atualizar status do cartão:", err);
      setError(err.message || "Erro inesperado ao atualizar status do cartão.");
    } finally {
      setLoading(false);
    }
  }
  async function saveSalary() {
    const numericValue = parseMoney(salaryInput);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      setError("Informe um salário válido.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await saveSalaryForMonth(activeBillingMonth, numericValue);
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao salvar salário:", err);
      setError(err.message || "Erro inesperado ao salvar salário.");
    } finally {
      setLoading(false);
    }
  }
  async function toggleFixedBillPaid(billId) {
    const selectedBill = fixedBills.find(
      (bill) => Number(bill.id ?? bill.Id) === Number(billId),
    );
    if (!selectedBill) {
      setError("Conta fixa não encontrada.");
      return;
    }
    const currentPaid = toBoolean(selectedBill.paid ?? selectedBill.Pago);
    const nextPaid = !currentPaid;
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/contas-fixas/${billId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mesReferencia: activeBillingMonth,
          pago: nextPaid,
        }),
      });
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          responseData?.error || "Erro ao atualizar status da conta fixa.",
        );
      }
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao atualizar status da conta fixa:", err);
      setError(
        err.message || "Erro inesperado ao atualizar status da conta fixa.",
      );
    } finally {
      setLoading(false);
    }
  }
  async function addExpense(event) {
    event.preventDefault();

    /*console.log("Clicou em Adicionar gasto", expense);*/

    const numericValue = parseMoney(expense.amount);
    if (!numericValue || numericValue <= 0) {
      setError("Informe um valor maior que zero.");
      console.warn("Valor inválido:", expense.amount, numericValue);
      return;
    }
    const selectedCard = cards.find(
      (card) => Number(card.id ?? card.Id) === Number(expense.cardId),
    );
    if (!selectedCard) {
      setError("Selecione um cartão válido.");
      console.warn("Cartão inválido:", expense.cardId, cards);
      return;
    }
    const payload = {
      idCartao: Number(selectedCard.id ?? selectedCard.Id),
      descricao: expense.description || "Gasto Mês",
      valor: Number(numericValue.toFixed(2)),
      dataHora: expense.dateInput,
      mesReferencia: activeBillingMonth,
    };

    /*console.log("Payload enviado para API:", payload);*/

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/gastos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      /*console.log("Status POST /api/gastos:", response.status);*/

      const responseData = await response.json().catch(() => null);

      /*console.log("Resposta POST /api/gastos:", responseData);*/

      if (!response.ok) {
        throw new Error(responseData?.error || "Erro ao cadastrar gasto.");
      }
      const nextHistoryMonth = isHistoryByBillingMonth
        ? activeBillingMonth
        : getMonthKeyFromDateText(expense.dateInput);
      setSelectedHistoryMonth(nextHistoryMonth);
      setExpense({
        cardId: Number(selectedCard.id ?? selectedCard.Id),
        description: "",
        amount: "",
        dateInput: getCurrentDateTimeLocal(),
      });
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao cadastrar gasto:", err);
      setError(err.message || "Erro inesperado ao cadastrar gasto.");
    } finally {
      setLoading(false);
    }
  }
  async function addSubscription(event) {
    event.preventDefault();
    const numericValue = parseMoney(newSubscription.amount);
    const numericDay = Number(newSubscription.chargeDay);
    const selectedCardId = Number(newSubscription.cardId);
    if (!newSubscription.name.trim()) {
      setError("Informe o nome do streaming/recorrente.");
      return;
    }
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      setError("Informe um valor válido.");
      return;
    }
    if (!numericDay || numericDay < 1 || numericDay > 31) {
      setError("Informe um dia de cobrança entre 1 e 31.");
      return;
    }
    if (newSubscription.inInvoice && !selectedCardId) {
      setError("Selecione um cartão para lançar na fatura.");
      return;
    }
    const payload = {
      nome: newSubscription.name.trim(),
      valor: Number(numericValue.toFixed(2)),
      diaCobranca: numericDay,
      idCartao: newSubscription.inInvoice ? selectedCardId : null,
      categoria: newSubscription.category || "Streaming",
      entraNaFatura: toBoolean(newSubscription.inInvoice),
    };
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/recorrentes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          responseData?.error || "Erro ao cadastrar streaming/recorrente.",
        );
      }
      setNewSubscription({
        name: "",
        amount: "0,00",
        chargeDay: "",
        cardId: cards[0]?.id || 1,
        category: "Streaming",
        inInvoice: true,
      });
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao cadastrar recorrente:", err);
      setError(
        err.message || "Erro inesperado ao cadastrar streaming/recorrente.",
      );
    } finally {
      setLoading(false);
    }
  }
  function startEditingSubscription(subscription) {
    setEditingSubscriptionId(Number(subscription.id ?? subscription.Id));
    setSubscriptionDraft({
      name: subscription.name ?? subscription.Nome ?? "",
      amount: formatMoneyInput(
        String(subscription.amount ?? subscription.Valor ?? 0).replace(
          ".",
          ",",
        ),
      ),
      chargeDay: String(
        subscription.chargeDay ?? subscription.DiaCobranca ?? "",
      ),
      category: subscription.category ?? subscription.Categoria ?? "Streaming",
    });
  }
  function cancelEditingSubscription() {
    setEditingSubscriptionId(null);
    setSubscriptionDraft({
      name: "",
      amount: "0,00",
      chargeDay: "",
      category: "Streaming",
    });
  }
  async function saveEditingSubscription(subscriptionId) {
    const numericValue = parseMoney(subscriptionDraft.amount);
    const numericDay = Number(subscriptionDraft.chargeDay);
    if (!subscriptionDraft.name.trim()) {
      setError("Informe o nome do streaming/recorrente.");
      return;
    }
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      setError("Informe um valor válido.");
      return;
    }
    if (!numericDay || numericDay < 1 || numericDay > 31) {
      setError("Informe um dia de cobrança entre 1 e 31.");
      return;
    }
    const payload = {
      nome: subscriptionDraft.name.trim(),
      valor: Number(numericValue.toFixed(2)),
      diaCobranca: numericDay,
      categoria: subscriptionDraft.category || "Streaming",
    };
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/recorrentes/${subscriptionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          responseData?.error || "Erro ao atualizar streaming/recorrente.",
        );
      }
      cancelEditingSubscription();
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao atualizar recorrente:", err);
      setError(
        err.message || "Erro inesperado ao atualizar streaming/recorrente.",
      );
    } finally {
      setLoading(false);
    }
  }
  async function removeSubscription(subscriptionId) {
    const confirmed = window.confirm(
      "Deseja remover este streaming/recorrente?",
    );
    if (!confirmed) return;
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/recorrentes/${subscriptionId}`, {
        method: "DELETE",
      });
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          responseData?.error || "Erro ao remover streaming/recorrente.",
        );
      }
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao remover recorrente:", err);
      setError(
        err.message || "Erro inesperado ao remover streaming/recorrente.",
      );
    } finally {
      setLoading(false);
    }
  }
  async function toggleSubscriptionInvoice(subscriptionId) {
    const subscription = subscriptions.find(
      (item) => Number(item.id ?? item.Id) === Number(subscriptionId),
    );
    if (!subscription) {
      setError("Streaming/recorrente não encontrado.");
      return;
    }
    const currentInInvoice = getSubscriptionInInvoice(subscription);
    const nextInInvoice = !currentInInvoice;
    const currentCardId = getSubscriptionCardId(subscription);
    const fallbackCardId = Number(cards[0]?.id ?? cards[0]?.Id);
    const nextCardId = nextInInvoice ? currentCardId || fallbackCardId : null;
    if (nextInInvoice && !nextCardId) {
      setError("Nenhum cartão disponível para colocar o recorrente na fatura.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${API_URL}/recorrentes/${subscriptionId}/fatura`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entraNaFatura: nextInInvoice,
            idCartao: nextCardId,
          }),
        },
      );
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          responseData?.error || "Erro ao atualizar fatura do recorrente.",
        );
      }
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao atualizar fatura do recorrente:", err);
      setError(
        err.message || "Erro inesperado ao atualizar fatura do recorrente.",
      );
    } finally {
      setLoading(false);
    }
  }
  async function updateSubscriptionCard(subscriptionId, cardId) {
    const nextCardId = Number(cardId);
    if (!nextCardId) {
      setError("Selecione um cartão válido.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${API_URL}/recorrentes/${subscriptionId}/cartao`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idCartao: nextCardId,
          }),
        },
      );
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          responseData?.error || "Erro ao atualizar cartão do recorrente.",
        );
      }
      await refreshDashboardMonth(activeBillingMonth);
    } catch (err) {
      console.error("Erro ao atualizar cartão do recorrente:", err);
      setError(
        err.message || "Erro inesperado ao atualizar cartão do recorrente.",
      );
    } finally {
      setLoading(false);
    }
  }
  function startEditingHistory(item) {
    setEditingHistoryId(item.id);
    setHistoryDraft({
      dateInput: dateTextToDateTimeLocal(item.date),
      cardName: item.cardName,
      description: item.description,
      amount: formatApiMoneyInput(getHistoryAmount(item)),
    });
  }
  function cancelEditingHistory() {
    setEditingHistoryId(null);
    setHistoryDraft({
      dateInput: "",
      cardName: "",
      description: "",
      amount: "",
    });
  }
  async function saveEditingHistory(item) {
    const numericValue = parseMoney(historyDraft.amount);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setError("Informe um valor válido.");
      return;
    }
    const nextCardName = historyDraft.cardName || item.cardName;
    const targetCard = cards.find(
      (card) => (card.name ?? card.Nome) === nextCardName,
    );
    if (!targetCard) {
      setError("Cartão inválido.");
      return;
    }
    const nextDate = dateTimeLocalToDateText(historyDraft.dateInput);
    const nextMonth =
      getHistoryBillingMonthKey(item) || getMonthKeyFromDateText(nextDate);
    const nextHistoryMonth = isHistoryByBillingMonth
      ? nextMonth
      : getMonthKeyFromDateText(nextDate);
    const nextDescription = historyDraft.description.trim() || "Gasto Mês";
    const payload = {
      idCartao: Number(targetCard.id ?? targetCard.Id),
      descricao: nextDescription,
      valor: Number(numericValue.toFixed(2)),
      dataHora: historyDraft.dateInput,
      mesReferencia: nextMonth,
    };
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/gastos/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(responseData?.error || "Erro ao atualizar gasto.");
      }
      setSelectedHistoryMonth(nextHistoryMonth);
      cancelEditingHistory();
      if (nextMonth !== activeBillingMonth) {
        invalidateDashboardMonth(nextMonth);
        setSelectedBillingMonth(nextMonth);
      } else {
        await refreshDashboardMonth(nextMonth);
      }
    } catch (err) {
      console.error("Erro ao atualizar gasto:", err);
      setError(err.message || "Erro inesperado ao atualizar gasto.");
    } finally {
      setLoading(false);
    }
  }
  async function removeHistoryItem(item) {
    const confirmed = window.confirm(
      `Deseja excluir o gasto "${item.description}" no valor de ${currency.format(getHistoryAmount(item))}?`,
    );
    if (!confirmed) return;
    const itemMonth =
      normalizeMonthKey(getHistoryMonthKey(item)) || activeBillingMonth;
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/gastos/${item.id}`, {
        method: "DELETE",
      });
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(responseData?.error || "Erro ao excluir gasto.");
      }
      if (editingHistoryId === item.id) {
        cancelEditingHistory();
      }
      if (itemMonth !== activeBillingMonth) {
        invalidateDashboardMonth(itemMonth);
        setSelectedBillingMonth(itemMonth);
      } else {
        await refreshDashboardMonth(itemMonth);
      }
    } catch (err) {
      console.error("Erro ao excluir gasto:", err);
      setError(err.message || "Erro inesperado ao excluir gasto.");
    } finally {
      setLoading(false);
    }
  }
  function getBaseChargeInputValue(cardId) {
    const inputKey = `${activeBillingMonth}-${cardId}`;
    if (Object.prototype.hasOwnProperty.call(baseChargeInputs, inputKey)) {
      return baseChargeInputs[inputKey];
    }
    return "";
  }
  function updateCardBaseChargeInput(cardId, value) {
    const inputKey = `${activeBillingMonth}-${cardId}`;
    setBaseChargeInputs((current) => ({
      ...current,
      [inputKey]: value,
    }));
  }
  async function saveCardBaseCharge(cardId, value) {
    if (!Number.isFinite(cardId) || cardId <= 0) {
      setError("Cartão inválido para salvar base/parcelas.");
      return;
    }

    const inputKey = `${activeBillingMonth}-${cardId}`;
    const numericValue = parseMoney(value);
    const amount = Number.isFinite(numericValue)
      ? Number(numericValue.toFixed(2))
      : 0;
    try {
      setSavingBaseChargeCardId(cardId);
      setLoading(true);
      setError("");
      const response = await fetch(
        `${API_URL}/cartoes/${cardId}/base-parcelas`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mesReferencia: activeBillingMonth,
            descricao: "Parcelas em andamento",
            valor: amount,
          }),
        },
      );
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(responseData?.error || "Erro ao salvar base/parcelas.");
      }
      await refreshDashboardMonth(activeBillingMonth);
      setBaseChargeInputs((current) => {
        const nextInputs = { ...current };
        delete nextInputs[inputKey];
        return nextInputs;
      });
    } catch (err) {
      console.error("Erro ao salvar base/parcelas:", err);
      setError(err.message || "Erro inesperado ao salvar base/parcelas.");
    } finally {
      setSavingBaseChargeCardId((current) =>
        current === cardId ? null : current,
      );
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-100 px-3 py-4 text-slate-900 sm:px-5 sm:py-6 lg:px-8 xl:px-10">
      <div className="mx-auto w-full max-w-[1600px] space-y-5 sm:space-y-6">
        {dashboardLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
            Atualizando dashboard...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 shadow-sm">
            {error}
          </div>
        )}
        <header className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl">
          <div className="grid min-w-0 gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:p-8">
            <div className="flex min-w-0 flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Controle financeiro
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Matheus
              </h1>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Balanço do mês
                </p>
                <p
                  className={`break-words text-3xl font-black leading-none sm:text-right sm:text-4xl ${monthlyBalance >= 0 ? "text-emerald-300" : "text-rose-300"}`}
                >
                  {currency.format(monthlyBalance)}
                </p>
              </div>

              <div className="mt-5 grid min-w-0 gap-3 text-sm sm:grid-cols-3">
                <div className="flex min-w-0 flex-col justify-between rounded-2xl bg-white/10 p-4 sm:col-span-3">
                  <label
                    className="text-xs font-semibold uppercase tracking-wide text-slate-400"
                    htmlFor="salary-input"
                  >
                    Salário
                  </label>
                  <div className="mt-2 flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 ring-emerald-300 transition focus-within:ring-2">
                    <span className="shrink-0 text-base font-bold text-slate-300">
                      R$
                    </span>
                    <input
                      id="salary-input"
                      value={salaryInput}
                      inputMode="decimal"
                      onChange={(event) =>
                        setSalaryInput(formatMoneyTyping(event.target.value))
                      }
                      onBlur={() =>
                        setSalaryInput(formatMoneyInput(salaryInput))
                      }
                      placeholder="1.900,00"
                      className="min-w-0 flex-1 bg-transparent text-lg font-bold text-white outline-none placeholder:text-slate-500 sm:text-xl"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={saveSalary}
                    disabled={loading}
                    className="mt-3 w-full rounded-xl bg-emerald-300 px-3 py-2 text-sm font-bold text-emerald-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Salvando..." : "Salvar salário"}
                  </button>
                </div>
                <div className="flex min-w-0 flex-col justify-between rounded-2xl bg-white/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Base/parcelas
                  </p>
                  <p className="break-words font-bold">
                    {currency.format(cardBaseTotal)}
                  </p>
                </div>
                <div className="flex min-w-0 flex-col justify-between rounded-2xl bg-white/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Gastos Mês cartões
                  </p>
                  <p className="break-words font-bold">
                    {currency.format(cardVariableTotal)}
                  </p>
                </div>
                <div className="flex min-w-0 flex-col justify-between rounded-2xl bg-white/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Streamings cartões
                  </p>
                  <p className="break-words font-bold">
                    {currency.format(recurringTotal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Falta pagar"
            value={currency.format(totalOpen)}
            icon={Wallet}
            accent="text-rose-600"
          />
          <StatCard
            label="Foi pago"
            value={currency.format(totalPaid)}
            icon={CheckCircle2}
            accent="text-emerald-600"
          />
          <StatCard
            label="Total Streamings"
            value={currency.format(recurringTotal)}
            icon={Repeat}
            accent="text-purple-600"
          />
        </section>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1.4fr)_minmax(420px,0.8fr)] 2xl:gap-6">
          <div className="min-w-0 space-y-5 sm:space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Cartões</h2>
                  <p className="text-sm text-slate-500">
                    O total do cartão soma base/parcelas, Gastos Mês e
                    streamings vinculados.
                  </p>
                </div>
                <CreditCard className="text-slate-400" />
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                {cards.map((card) => {
                  const base = getBaseTotal(card.id);
                  const variable = getVariableTotal(card.name);
                  const recurring = getRecurringTotal(card.id);
                  const total = getCardTotal(card);
                  return (
                    <article
                      key={card.id}
                      className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
                    >
                      <div
                        className={`bg-gradient-to-br ${card.tone} p-5 text-white`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold">
                              {card.name}
                            </h3>
                            <p className="mt-2 break-words text-2xl font-black sm:text-3xl">
                              {currency.format(total)}
                            </p>
                            <p className="mt-1 max-w-full text-xs leading-5 text-white/85 sm:text-sm">
                              {currency.format(base)} base +{" "}
                              {currency.format(variable)} Gastos Mês +{" "}
                              {currency.format(recurring)} streamings
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleCardPaid(card.id ?? card.Id)}
                            className={`shrink-0 rounded-2xl px-3 py-2 text-sm font-bold transition ${toBoolean(card.paid ?? card.Pago) ? "bg-emerald-300 text-emerald-950" : "bg-white/20 text-white hover:bg-white/30"}`}
                          >
                            {toBoolean(card.paid ?? card.Pago)
                              ? "Pago"
                              : "Pagar"}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 p-4 text-sm min-[520px]:grid-cols-2">
                        <div className="min-w-0 rounded-2xl bg-white p-3">
                          <p className="text-slate-500">Base/parcelas</p>
                          <p className="break-words font-bold">
                            {currency.format(base)}
                          </p>
                        </div>
                        <div className="min-w-0 rounded-2xl bg-white p-3">
                          <p className="text-slate-500">Gastos Mês</p>
                          <p className="break-words font-bold">
                            {currency.format(variable)}
                          </p>
                        </div>
                        <div className="min-w-0 rounded-2xl bg-white p-3">
                          <p className="text-slate-500">Streamings</p>
                          <p className="break-words font-bold">
                            {currency.format(recurring)}
                          </p>
                        </div>
                        <div className="min-w-0 rounded-2xl bg-white p-3">
                          <p className="text-slate-500">Total</p>
                          <p className="break-words font-bold">
                            {currency.format(total)}
                          </p>
                        </div>
                        <div className="min-w-0 rounded-2xl bg-white p-3">
                          <p className="text-slate-500">Fecha</p>
                          <p className="break-words font-bold">
                            {card.closeDay
                              ? `Dia ${card.closeDay}`
                              : "Variável"}
                          </p>
                        </div>
                        <div className="min-w-0 rounded-2xl bg-white p-3">
                          <p className="text-slate-500">Vence</p>
                          <p className="break-words font-bold">
                            Dia {card.dueDay}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Contas fixas</h2>
                  <p className="text-sm text-slate-500">
                    Valores que não recebem lançamentos de gasto, apenas
                    controle de pagamento.
                  </p>
                </div>
                <Smartphone className="text-slate-400" />
              </div>

              <div className="space-y-3">
                <form
                  onSubmit={addFixedBill}
                  className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-bold">Adicionar conta fixa</p>

                  <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
                    <input
                      value={newFixedBill.name}
                      onChange={(event) =>
                        setNewFixedBill((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Nome"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2"
                    />

                    <input
                      value={newFixedBill.category}
                      onChange={(event) =>
                        setNewFixedBill((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      placeholder="Categoria"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2"
                    />

                    <MoneyInput
                      value={newFixedBill.amount}
                      onChange={(value) =>
                        setNewFixedBill((current) => ({
                          ...current,
                          amount: value,
                        }))
                      }
                      className="bg-white"
                    />

                    <input
                      value={newFixedBill.dueDay}
                      onChange={(event) =>
                        setNewFixedBill((current) => ({
                          ...current,
                          dueDay: event.target.value,
                        }))
                      }
                      placeholder="Dia vencimento"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-3 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Salvando..." : "Adicionar conta fixa"}
                  </button>
                </form>

                {fixedBills.map((bill) => {
                  const fixedBillCategory = getFixedBillCategory(bill);

                  return (
                    <div
                      key={bill.id ?? bill.Id}
                      className="flex min-w-0 flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {fixedBillCategory && (
                            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                              {fixedBillCategory}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-slate-500">
                            Vence dia {bill.dueDay}
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg font-bold">{bill.name}</h3>
                        <p className="mt-1 break-words text-2xl font-black">
                          {currency.format(getFixedBillAmount(bill))}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFixedBillPaid(bill.id ?? bill.Id)}
                        className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${toBoolean(bill.paid ?? bill.Pago ?? bill.pago) ? "bg-emerald-100 text-emerald-700" : "bg-slate-950 text-white hover:bg-slate-800"}`}
                      >
                        {toBoolean(bill.paid ?? bill.Pago ?? bill.pago)
                          ? "Pago"
                          : "Marcar como pago"}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEditingFixedBill(bill)}
                        className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFixedBill(bill)}
                        className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
                      >
                        Remover
                      </button>
                      {editingFixedBillId === Number(bill.id ?? bill.Id) && (
                        <div className="w-full basis-full rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="mb-3 text-sm font-bold text-slate-900">
                            Editar conta fixa
                          </p>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <input
                              value={fixedBillDraft.name}
                              onChange={(event) =>
                                setFixedBillDraft((current) => ({
                                  ...current,
                                  name: event.target.value,
                                }))
                              }
                              placeholder="Nome"
                              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2"
                            />

                            <input
                              value={fixedBillDraft.category}
                              onChange={(event) =>
                                setFixedBillDraft((current) => ({
                                  ...current,
                                  category: event.target.value,
                                }))
                              }
                              placeholder="Categoria"
                              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2"
                            />

                            <MoneyInput
                              value={fixedBillDraft.amount}
                              onChange={(value) =>
                                setFixedBillDraft((current) => ({
                                  ...current,
                                  amount: value,
                                }))
                              }
                              className="bg-slate-50"
                            />

                            <input
                              value={fixedBillDraft.dueDay}
                              onChange={(event) =>
                                setFixedBillDraft((current) => ({
                                  ...current,
                                  dueDay: event.target.value,
                                }))
                              }
                              placeholder="Dia vencimento"
                              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2"
                            />
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                saveEditingFixedBill(bill.id ?? bill.Id)
                              }
                              disabled={loading}
                              className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {loading ? "Salvando..." : "Salvar"}
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditingFixedBill}
                              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-5 sm:space-y-6">
            <form
              onSubmit={addExpense}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Novo Gasto Mês</h2>
                  <p className="text-sm text-slate-500">
                    O lançamento aumenta o total de Gastos Mês do cartão e
                    mantém os streamings separados.
                  </p>
                </div>
                <Plus className="text-slate-400" />
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Valor
                  </span>
                  <MoneyInput
                    value={expense.amount}
                    onChange={(value) =>
                      setExpense((current) => ({
                        ...current,
                        amount: value,
                      }))
                    }
                    className="mt-2 bg-slate-50"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Data/hora
                  </span>
                  <input
                    type="datetime-local"
                    value={expense.dateInput}
                    onChange={(event) =>
                      setExpense((current) => ({
                        ...current,
                        dateInput: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-slate-300 transition focus:ring-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Descrição
                  </span>
                  <input
                    value={expense.description}
                    onChange={(event) =>
                      setExpense((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Mercado, lanche, farmácia..."
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-slate-300 transition focus:ring-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Cartão
                  </span>
                  <select
                    value={expense.cardId}
                    onChange={(event) =>
                      setExpense((current) => ({
                        ...current,
                        cardId: Number(event.target.value),
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-slate-300 transition focus:ring-2"
                  >
                    {cards.map((card) => (
                      <option
                        key={card.id ?? card.Id}
                        value={card.id ?? card.Id}
                      >
                        {card.name ?? card.Nome}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Adicionar gasto
                </button>
              </div>
            </form>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
                <div className="min-w-0 self-center">
                  <h2 className="text-xl font-bold">Resumo da fatura</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Base/parcelas, Gastos Mês e streamings recalculam conforme o
                    mês da fatura.
                  </p>
                </div>

                <div className="grid min-w-0 gap-3">
                  <label className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Mês da fatura
                    </span>
                    <select
                      value={activeBillingMonth}
                      onChange={(event) =>
                        setSelectedBillingMonth(event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold capitalize text-slate-900 outline-none ring-slate-300 transition focus:ring-2"
                    >
                      {billingMonthOptions.map((monthKey) => (
                        <option key={monthKey} value={monthKey}>
                          {getMonthLabel(monthKey)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-900">
                      Adicionar novo mês de fatura
                    </p>

                    <div className="mt-3 grid min-w-0 gap-3">
                      <input
                        type="month"
                        value={newBillingMonth}
                        onChange={(event) =>
                          setNewBillingMonth(event.target.value)
                        }
                        className="h-12 w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold outline-none ring-slate-300 transition focus:ring-2"
                      />

                      <button
                        type="button"
                        onClick={addBillingMonth}
                        disabled={loading || !newBillingMonth}
                        className="h-12 w-full rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Adicionando..." : "Adicionar mês"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {cards.map((card) => {
                  const cardId = getCardId(card);
                  const cardName = getCardName(card);
                  const base = getBaseTotal(cardId);
                  const variable = getVariableTotal(cardName);
                  const recurring = getRecurringTotal(cardId);
                  const total = getCardTotal(card);
                  const styles = getCardColorStyles(cardName);
                  return (
                    <div
                      key={cardId}
                      className={`min-w-0 rounded-3xl border p-4 ${styles.summary}`}
                    >
                      <p className={`text-sm font-semibold ${styles.title}`}>
                        Resumo {cardName || "Cartão"}
                      </p>
                      <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(128px,1fr))] gap-2 text-sm">
                        <div className="min-w-0 rounded-2xl bg-white p-3">
                          <p className="text-slate-500">Base/parcelas</p>
                          <p className="break-words font-bold">
                            {currency.format(base)}
                          </p>
                        </div>
                        <div className="min-w-0 rounded-2xl bg-white p-3">
                          <p className="text-slate-500">Gastos Mês</p>
                          <p className="break-words font-bold">
                            {currency.format(variable)}
                          </p>
                        </div>
                        <div className="min-w-0 rounded-2xl bg-white p-3">
                          <p className="text-slate-500">Streamings</p>
                          <p className="break-words font-bold">
                            {currency.format(recurring)}
                          </p>
                        </div>
                        <div className="min-w-0 rounded-2xl bg-white p-3">
                          <p className="text-slate-500">Total</p>
                          <p className="break-words font-bold">
                            {currency.format(total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-bold">Base/parcelas do mês</p>
                <p className="mt-1 text-sm text-slate-500">
                  Edite os valores fixos da fatura para{" "}
                  {getMonthLabel(activeBillingMonth)}.
                </p>
                <div className="mt-3 grid min-w-0 gap-3">
                  {cards.map((card) => {
                    const cardId = getCardId(card);
                    const cardName = getCardName(card);
                    const styles = getCardColorStyles(cardName);
                    return (
                      <label
                        key={cardId}
                        className="block rounded-2xl bg-white p-3"
                      >
                        <span
                          className={`text-xs font-bold uppercase tracking-wide ${styles.title}`}
                        >
                          {cardName || "Cartão"}
                        </span>
                        <MoneyInput
                          value={getBaseChargeInputValue(cardId)}
                          onChange={(value) =>
                            updateCardBaseChargeInput(cardId, value)
                          }
                          className="mt-2 bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            saveCardBaseCharge(
                              cardId,
                              getBaseChargeInputValue(cardId),
                            )
                          }
                          disabled={
                            (loading && savingBaseChargeCardId === null) ||
                            savingBaseChargeCardId === cardId
                          }
                          className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingBaseChargeCardId === cardId
                            ? "Salvando..."
                            : "Salvar base/parcelas"}
                        </button>
                      </label>
                    );
                  })}
                </div>
              </div>

              <form
                onSubmit={addSubscription}
                className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="font-bold">Adicionar streaming/recorrente</p>
                <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
                  <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm ring-slate-300 transition focus-within:ring-2">
                    <NewSubscriptionIcon
                      size={18}
                      className={`shrink-0 ${newSubscriptionIconConfig.className}`}
                      aria-hidden="true"
                    />
                    <input
                      value={newSubscription.name}
                      onChange={(event) =>
                        setNewSubscription((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Nome"
                      className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
                    />
                  </label>
                  <MoneyInput
                    value={newSubscription.amount}
                    onChange={(value) =>
                      setNewSubscription((current) => ({
                        ...current,
                        amount: value,
                      }))
                    }
                    className="bg-white"
                  />
                  <input
                    value={newSubscription.chargeDay}
                    onChange={(event) =>
                      setNewSubscription((current) => ({
                        ...current,
                        chargeDay: event.target.value,
                      }))
                    }
                    placeholder="Dia cobrança"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2"
                  />
                  <select
                    value={newSubscription.category}
                    onChange={(event) =>
                      setNewSubscription((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2"
                  >
                    <option>Streaming</option>
                    <option>Recorrente</option>
                    <option>Assinatura</option>
                    <option>Serviço</option>
                  </select>
                  <select
                    value={newSubscription.cardId}
                    disabled={!newSubscription.inInvoice}
                    onChange={(event) =>
                      setNewSubscription((current) => ({
                        ...current,
                        cardId: Number(event.target.value),
                      }))
                    }
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2 disabled:opacity-50"
                  >
                    {cards.map((card) => {
                      const cardId = Number(card.id ?? card.Id);
                      const cardName = card.name ?? card.Nome;
                      return (
                        <option key={cardId} value={cardId}>
                          {cardName}
                        </option>
                      );
                    })}
                  </select>
                  <label className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={newSubscription.inInvoice}
                      onChange={(event) =>
                        setNewSubscription((current) => ({
                          ...current,
                          inInvoice: event.target.checked,
                        }))
                      }
                    />
                    Entra na fatura
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-3 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Adicionar streaming/recorrente
                </button>
              </form>

              <div className="mt-4 space-y-3">
                {subscriptions.map((subscription) => {
                  const subscriptionCardId =
                    getSubscriptionCardId(subscription);
                  const subscriptionInInvoice =
                    getSubscriptionInInvoice(subscription);
                  const linkedCard = cards.find(
                    (card) => card.id === subscriptionCardId,
                  );
                  const linkedCardStyles = linkedCard
                    ? getCardColorStyles(linkedCard.name)
                    : getCardColorStyles();
                  const subscriptionIconConfig = getSubscriptionIconConfig(
                    subscription.name,
                  );
                  const SubscriptionIcon = subscriptionIconConfig.icon;
                  const editingSubscriptionIconConfig =
                    getSubscriptionIconConfig(
                      subscriptionDraft.name || subscription.name,
                    );
                  const EditingSubscriptionIcon =
                    editingSubscriptionIconConfig.icon;
                  return (
                    <div
                      key={subscription.id}
                      className="min-w-0 rounded-2xl bg-slate-50 p-3 text-sm"
                    >
                      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                            <SubscriptionIcon
                              size={18}
                              className={subscriptionIconConfig.className}
                              aria-hidden="true"
                            />
                          </span>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold">{subscription.name}</p>
                              <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-bold text-slate-600">
                                {subscription.category}
                              </span>
                              {linkedCard && (
                                <span
                                  className={`rounded-full px-2 py-1 text-[11px] font-bold ${linkedCardStyles.badge}`}
                                >
                                  {linkedCard.name}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-slate-500">
                              Cobra dia {subscription.chargeDay}
                              {linkedCard
                                ? ` • ${linkedCard.name}`
                                : " • Fora da fatura"}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                          <p className="font-bold">
                            {currency.format(
                              getSubscriptionAmount(subscription),
                            )}
                          </p>
                          <p
                            className={
                              subscriptionInInvoice
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }
                          >
                            {subscriptionInInvoice ? "Na fatura" : "Fora"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <select
                          value={subscriptionCardId || ""}
                          disabled={!subscriptionInInvoice}
                          onChange={(event) =>
                            updateSubscriptionCard(
                              subscription.id,
                              event.target.value,
                            )
                          }
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition disabled:opacity-50"
                        >
                          {cards.map((card) => {
                            const cardId = Number(card.id ?? card.Id);
                            const cardName = card.name ?? card.Nome;
                            return (
                              <option key={cardId} value={cardId}>
                                {cardName}
                              </option>
                            );
                          })}
                        </select>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              toggleSubscriptionInvoice(
                                subscription.id ?? subscription.Id,
                              )
                            }
                            className="flex-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                          >
                            {subscriptionInInvoice
                              ? "Tirar da fatura"
                              : "Colocar na fatura"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              startEditingSubscription(subscription)
                            }
                            className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeSubscription(
                                subscription.id ?? subscription.Id,
                              )
                            }
                            className="rounded-xl bg-rose-50 px-3 py-2 text-rose-600 transition hover:bg-rose-100"
                            title="Remover"
                          >
                            <Trash2 size={16} />
                          </button>
                          {editingSubscriptionId ===
                            Number(subscription.id ?? subscription.Id) && (
                            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                              <p className="mb-3 text-sm font-bold text-slate-900">
                                Editar streaming/recorrente
                              </p>

                              <div className="grid gap-3 sm:grid-cols-2">
                                <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm ring-slate-300 transition focus-within:ring-2">
                                  <EditingSubscriptionIcon
                                    size={18}
                                    className={`shrink-0 ${editingSubscriptionIconConfig.className}`}
                                    aria-hidden="true"
                                  />
                                  <input
                                    value={subscriptionDraft.name}
                                    onChange={(event) =>
                                      setSubscriptionDraft((current) => ({
                                        ...current,
                                        name: event.target.value,
                                      }))
                                    }
                                    placeholder="Nome"
                                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
                                  />
                                </label>

                                <MoneyInput
                                  value={subscriptionDraft.amount}
                                  onChange={(value) =>
                                    setSubscriptionDraft((current) => ({
                                      ...current,
                                      amount: value,
                                    }))
                                  }
                                  className="bg-slate-50"
                                />

                                <input
                                  value={subscriptionDraft.chargeDay}
                                  onChange={(event) =>
                                    setSubscriptionDraft((current) => ({
                                      ...current,
                                      chargeDay: event.target.value,
                                    }))
                                  }
                                  placeholder="Dia cobrança"
                                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2"
                                />

                                <select
                                  value={subscriptionDraft.category}
                                  onChange={(event) =>
                                    setSubscriptionDraft((current) => ({
                                      ...current,
                                      category: event.target.value,
                                    }))
                                  }
                                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-slate-300 transition focus:ring-2"
                                >
                                  <option>Streaming</option>
                                  <option>Recorrente</option>
                                  <option>Assinatura</option>
                                  <option>Serviço</option>
                                </select>
                              </div>

                              <div className="mt-3 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    saveEditingSubscription(
                                      subscription.id ?? subscription.Id,
                                    )
                                  }
                                  disabled={loading}
                                  className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {loading ? "Salvando..." : "Salvar"}
                                </button>

                                <button
                                  type="button"
                                  onClick={cancelEditingSubscription}
                                  className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </section>

        <section className="grid min-w-0 gap-5 2xl:items-start 2xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.55fr)] 2xl:gap-6">
          <div className="min-w-0 self-start rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Histórico de Gastos
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Alterna entre a fatura cobrada e a data real do lançamento.
                  </p>
                </div>

                <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 xl:max-w-2xl">
                  <div className="flex h-full min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Visão
                    </p>
                    <div className="mt-2 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                      <button
                        type="button"
                        aria-pressed={isHistoryByBillingMonth}
                        onClick={() =>
                          setSelectedHistoryView(HISTORY_VIEW_BY_BILLING)
                        }
                        className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                          isHistoryByBillingMonth
                            ? "bg-white text-slate-950 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Por fatura
                      </button>
                      <button
                        type="button"
                        aria-pressed={!isHistoryByBillingMonth}
                        onClick={() =>
                          setSelectedHistoryView(HISTORY_VIEW_BY_EXPENSE_DATE)
                        }
                        className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                          !isHistoryByBillingMonth
                            ? "bg-white text-slate-950 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Por data do gasto
                      </button>
                    </div>
                  </div>

                  <label className="flex h-full min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {historyMonthFieldLabel}
                    </span>
                    <select
                      value={activeHistoryMonth}
                      onChange={(event) =>
                        setSelectedHistoryMonth(event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-lg font-black capitalize text-slate-900 outline-none ring-slate-300 transition focus:bg-white focus:ring-2"
                    >
                      {historyMonthOptions.length === 0 ? (
                        <option value={activeHistoryMonth}>
                          Sem histórico
                        </option>
                      ) : (
                        historyMonthOptions.map((monthKey) => (
                          <option key={monthKey} value={monthKey}>
                            {getMonthLabel(monthKey)}
                          </option>
                        ))
                      )}
                    </select>
                  </label>

                  <div className="flex h-full min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Total de gastos
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-900">
                      {currency.format(selectedHistoryTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="w-full overflow-x-auto">
                <table className="w-full table-auto text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Data/hora</th>
                      {!isHistoryByBillingMonth && (
                        <th className="px-4 py-3">Mês da fatura</th>
                      )}
                      <th className="px-4 py-3">Cartão</th>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3">
                        {isHistoryByBillingMonth ? "Gasto novo" : "Valor"}
                      </th>
                      {isHistoryByBillingMonth && (
                        <>
                          <th className="px-4 py-3">Total antes</th>
                          <th className="px-4 py-3">Total depois</th>
                        </>
                      )}
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td
                          colSpan={isHistoryByBillingMonth ? 7 : 6}
                          className="px-4 py-8 text-center text-slate-500"
                        >
                          {historyEmptyMessage}
                        </td>
                      </tr>
                    )}

                    {filteredHistory.map((item) => {
                      const isEditing = editingHistoryId === item.id;
                      return (
                        <tr key={item.id}>
                          <td className="max-w-[180px] break-words px-4 py-3 align-top font-medium">
                            {isEditing ? (
                              <input
                                type="datetime-local"
                                value={historyDraft.dateInput}
                                onChange={(event) =>
                                  setHistoryDraft((current) => ({
                                    ...current,
                                    dateInput: event.target.value,
                                  }))
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none ring-slate-300 focus:ring-2"
                              />
                            ) : (
                              item.date
                            )}
                          </td>
                          {!isHistoryByBillingMonth && (
                            <td className="max-w-[150px] break-words px-4 py-3 align-top capitalize">
                              {getMonthLabel(getHistoryMonthKey(item))}
                            </td>
                          )}
                          <td className="max-w-[120px] break-words px-4 py-3 align-top">
                            {isEditing ? (
                              <select
                                value={historyDraft.cardName}
                                onChange={(event) =>
                                  setHistoryDraft((current) => ({
                                    ...current,
                                    cardName: event.target.value,
                                  }))
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none ring-slate-300 focus:ring-2"
                              >
                                {cards.map((card) => (
                                  <option key={card.id} value={card.name}>
                                    {card.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              item.cardName
                            )}
                          </td>
                          <td className="max-w-[240px] break-words px-4 py-3 align-top">
                            {isEditing ? (
                              <input
                                value={historyDraft.description}
                                onChange={(event) =>
                                  setHistoryDraft((current) => ({
                                    ...current,
                                    description: event.target.value,
                                  }))
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none ring-slate-300 focus:ring-2"
                              />
                            ) : (
                              item.description
                            )}
                          </td>
                          <td className="max-w-[140px] break-words px-4 py-3 align-top text-rose-600">
                            {isEditing ? (
                              <MoneyInput
                                value={historyDraft.amount}
                                onChange={(value) =>
                                  setHistoryDraft((current) => ({
                                    ...current,
                                    amount: value,
                                  }))
                                }
                                ringClassName="ring-slate-300"
                                className="w-full bg-slate-50 px-3 py-2"
                              />
                            ) : (
                              currency.format(getHistoryAmount(item))
                            )}
                          </td>
                          {isHistoryByBillingMonth && (
                            <>
                              <td className="max-w-[140px] break-words px-4 py-3 align-top">
                                {currency.format(item.before)}
                              </td>
                              <td className="max-w-[140px] break-words px-4 py-3 align-top font-bold">
                                {isEditing
                                  ? currency.format(
                                      item.before +
                                        (parseMoney(historyDraft.amount) || 0),
                                    )
                                  : currency.format(item.after)}
                              </td>
                            </>
                          )}
                          <td className="px-4 py-3 align-top">
                            <div className="flex justify-end gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => saveEditingHistory(item)}
                                    className="rounded-xl bg-emerald-100 px-3 py-2 text-emerald-700 transition hover:bg-emerald-200"
                                    title="Salvar"
                                  >
                                    <Save size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEditingHistory}
                                    className="rounded-xl bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
                                    title="Cancelar"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => startEditingHistory(item)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
                                    title="Editar"
                                  >
                                    <Pencil size={16} />
                                    <span className="text-xs font-bold">
                                      Editar
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeHistoryItem(item)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-rose-600 transition hover:bg-rose-100"
                                    title="Excluir"
                                  >
                                    <Trash2 size={16} />
                                    <span className="text-xs font-bold">
                                      Excluir
                                    </span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <section className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <CalendarDays className="text-slate-400" />
              <div>
                <h2 className="text-xl font-bold">Calendário financeiro</h2>
                <p className="text-sm text-slate-500">
                  Atualizado automaticamente com cartões, streamings e contas
                  fixas.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {calendarItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold leading-5 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
export default App;
