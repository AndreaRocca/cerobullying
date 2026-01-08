import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  MessageCircle,
  HeartHandshake,
  Lock,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Info,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

/**
 * PROTOTYPE ONLY (front-end):
 * - No envía datos a ningún servidor.
 * - “Enviar” simula la acción y genera un resumen.
 *
 * Nota: Esta versión está simplificada (sin shadcn/ui) para que compile fácil en Vite.
 */
 
const gradient = "bg-[#3B2A22]";
const glass = "bg-[#4A342A]/70 backdrop-blur-md border border-white/12";


const chips = [
  "Insultos / burlas",
  "Exclusión",
  "Amenazas",
  "Ciberbullying",
  "Rumores",
  "Agresión física",
  "Robo / daño de pertenencias",
  "Discriminación",
];

const locations = ["Aula", "Patio", "Pasillo", "Baño", "Salida", "Redes sociales", "Grupo de chat", "Otro"];
const grades = ["1°", "2°", "3°", "4°", "5°", "6°", "7°", "No aplica"];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ------------------------
// UI mínima (sin dependencias)
// ------------------------
function Card({ className = "", children }) {
  return <div className={cn("rounded-3xl", className)}>{children}</div>;
}
function CardHeader({ className = "", children }) {
  return <div className={cn("p-6 pb-2", className)}>{children}</div>;
}
function CardTitle({ className = "", children }) {
  return <div className={cn("text-lg font-semibold", className)}>{children}</div>;
}
function CardDescription({ className = "", children }) {
  return <div className={cn("mt-1 text-sm", className)}>{children}</div>;
}
function CardContent({ className = "", children }) {
  return <div className={cn("p-6 pt-2", className)}>{children}</div>;
}

function Button({ className = "", variant = "primary", disabled, onClick, children, type = "button" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/30";
  const styles =
  variant === "secondary"
    ? "bg-white/10 hover:bg-white/15 border border-white/10 text-white"
	: "bg-[#F88631] text-white hover:bg-[#E57525]";

  const dis = disabled ? "opacity-50 cursor-not-allowed hover:bg-inherit" : "";
  return (
    <button type={type} className={cn(base, styles, dis, className)} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

function Input({ className = "", value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20",
        className
      )}
    />
  );
}

function Textarea({ className = "", value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20",
        className
      )}
    />
  );
}

function Label({ className = "", children }) {
  return <div className={cn("text-sm font-semibold", className)}>{children}</div>;
}

function Badge({ className = "", children }) {
  return <span className={cn("inline-flex items-center rounded-xl bg-white/10 border border-white/10 px-2 py-0.5 text-xs", className)}>{children}</span>;
}

function Separator({ className = "" }) {
  return <div className={cn("h-px w-full bg-white/10", className)} />;
}

function Checkbox({ checked, onChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className="h-4 w-4 accent-white"
    />
  );
}

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full border transition",
        checked ? "bg-white/25 border-white/30" : "bg-white/10 border-white/15"
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white transition",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}

function SelectNative({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-slate-900">
          {opt}
        </option>
      ))}
    </select>
  );
}

function Disclosure({ buttonLabel, title, description, children }) {
  return (
    <details className="group">
      <summary className="list-none">
        <Button variant="secondary" className="rounded-2xl">
          {buttonLabel}
        </Button>
      </summary>
      <div className="mt-3 rounded-3xl bg-black/30 border border-white/10 p-5">
        {title && <div className="text-base font-semibold">{title}</div>}
        {description && <div className="mt-1 text-sm text-white/70">{description}</div>}
        <div className="mt-4">{children}</div>
      </div>
    </details>
  );
}

function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  const ctx = useMemo(() => ({ value, setValue }), [value]);
  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
}

const TabsContext = React.createContext(null);

function TabsList({ className = "", children }) {
  return <div className={cn("flex gap-2", className)}>{children}</div>;
}

function TabsTrigger({ value, className = "", children }) {
  const ctx = React.useContext(TabsContext);
  const active = ctx?.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={cn(
        "rounded-2xl px-4 py-2 text-sm font-semibold border transition",
active
  ? "bg-[#F88631] text-white border-[#F88631]"
  : "[#7c5a5a] border-white/10 text-white/80 hover:bg-black/30",
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, className = "", children }) {
  const ctx = React.useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return <div className={className}>{children}</div>;
}

// ------------------------
// Componentes de la UI original
// ------------------------
function Pill({ icon: Icon, title, text }) {
  return (
    <div className={cn("flex gap-3 rounded-2xl p-4", glass)}>
      <div className="mt-0.5">
        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <div className="font-semibold text-white/95">{title}</div>
        <div className="text-sm text-white/70 leading-relaxed">{text}</div>
      </div>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className={cn("rounded-2xl p-4", glass)}>
      <div className="flex items-center gap-2">
        <Badge className="rounded-xl">Paso {n}</Badge>
        <div className="font-semibold text-white/95">{title}</div>
      </div>
      <div className="mt-2 text-sm text-white/70 leading-relaxed">{text}</div>
    </div>
  );
}

function ToastLike({ title, body, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      className={cn("rounded-2xl p-4", glass)}
    >
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold text-white/95">{title}</div>
          <div className="text-sm text-white/70 leading-relaxed mt-1 whitespace-pre-line">{body}</div>
        </div>
      </div>
    </motion.div>
  );
}

function PositiveNudges() {
  const prompts = useMemo(
    () => [
      { title: "Frase puente", text: "“No estoy de acuerdo con eso. Mejor paremos.”" },
      { title: "Cambio de foco", text: "“Che, ¿venís conmigo? Vamos a otro lado.”" },
      { title: "Validación", text: "“Eso que te hicieron no está bien. Estoy acá.”" },
      { title: "Pedido claro", text: "“Bajemos un cambio. Hablemos sin bardear.”" },
      { title: "En redes", text: "“No difundas. Guardá evidencia y pedí ayuda.”" },
    ],
    []
  );

  return (
    <Card className={cn(glass, "rounded-3xl")}> 
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5" />
          Intervenciones de comunicación positiva
        </CardTitle>
        <CardDescription className="text-white/70">Mini-guiones para frenar la escalada, acompañar y pedir ayuda.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-3">
        {prompts.map((p) => (
          <div key={p.title} className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
            <div className="font-semibold text-white/95">{p.title}</div>
            <div className="mt-1 text-sm text-white/75">{p.text}</div>
          </div>
        ))}
        <div className={cn("rounded-2xl p-4 md:col-span-2", "bg-[#5A4033]/50 border border-white/15")}>
          <div className="flex items-center gap-2 text-white/95 font-semibold">
            <HeartHandshake className="h-4 w-4" />
            Recordatorio
          </div>
          <div className="mt-1 text-sm text-white/75 leading-relaxed">
            Comunicación positiva no es “minimizar”. Es intervenir con respeto, proteger a quien la pasa mal y activar el
            protocolo de la escuela.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BullyingReportPrototype() {
  const [anonymous, setAnonymous] = useState(true);
  const [contactOk, setContactOk] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("3°");
  const [location, setLocation] = useState("Aula");
  const [when, setWhen] = useState("Ayer");
  const [what, setWhat] = useState([]);
  const [details, setDetails] = useState("");
  const [evidence, setEvidence] = useState(false);
  const [danger, setDanger] = useState(false);
  const [sent, setSent] = useState(false);

  const canSend = useMemo(() => {
    if (!details.trim()) return false;
    if (!anonymous && contactOk) return Boolean(name.trim()) && Boolean(email.trim());
    return true;
  }, [details, anonymous, contactOk, name, email]);

  const summary = useMemo(() => {
    const tag = what.length ? what.join(", ") : "(sin etiquetas)";
    return {
      title: danger ? "Marcaste una situación urgente" : "Comunicación lista para enviar",
      body: `Curso: ${course} • Lugar: ${location} • Cuándo: ${when}
Tipo: ${tag}
Evidencia: ${evidence ? "Sí" : "No"}

Detalle: ${details.slice(0, 220)}${details.length > 220 ? "…" : ""}`,
    };
  }, [course, location, when, what, evidence, details, danger]);

  const toggleTag = (t) => {
    setWhat((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const reset = () => {
    setAnonymous(true);
    setContactOk(false);
    setName("");
    setEmail("");
    setCourse("3°");
    setLocation("Aula");
    setWhen("Ayer");
    setWhat([]);
    setDetails("");
    setEvidence(false);
    setDanger(false);
    setSent(false);
  };

  return (
  <div className={cn("min-h-screen text-[#2B1E18]", gradient)}>
    {/* Halos de color */}
    <div className="pointer-events-none absolute -top-48 -left-48 h-[560px] w-[560px] rounded-full bg-[#F88631]/18 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-56 -right-56 h-[720px] w-[720px] rounded-full bg-[#F88631]/10 blur-3xl" />

    {/* Contenido */}
    <div className="max-w-6xl mx-auto px-4 py-10 relative">

        <header className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
Hablemos. No estás solo/a.</div>
                <div className="text-white/70">Canal seguro para pedir ayuda y activar acompañamiento escolar.</div>
              </div>
            </div>

            <Disclosure
              buttonLabel={
                <>
                  <Info className="h-4 w-4" /> ¿Cómo funciona?
                </>
              }
              title="Cómo funciona este canal"
              description="Prototipo: simula la experiencia. En un sitio real, esto enviaría tu comunicación al Equipo de Convivencia."
            >
              <div className="space-y-3 text-sm leading-relaxed text-white/80">
                <div className="flex gap-2">
                  <ClipboardList className="h-4 w-4 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">1) Contás lo que pasó</div>
                    <div className="text-white/70">Con el nivel de detalle que puedas. Podés marcar si tenés evidencia.</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Shield className="h-4 w-4 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">2) Se activa un protocolo</div>
                    <div className="text-white/70">Registro, evaluación de riesgo, intervención y seguimiento.</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <HeartHandshake className="h-4 w-4 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">3) Acompañamiento</div>
                    <div className="text-white/70">Comunicación positiva, reparación, cuidado y comunidad.</div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Si hay peligro inmediato</div>
                    <div className="text-white/70">
                      Buscá a un adulto ya. En Argentina: ante una emergencia, llamá al 911. Si hay riesgo de autolesión,
                      pedí ayuda urgente a un adulto y a servicios de salud.
                    </div>
                  </div>
                </div>
              </div>
            </Disclosure>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <Pill icon={Lock} title="Confidencial" text="Podés reportar en forma anónima. La escuela recibe lo necesario para actuar." />
            <Pill icon={MessageCircle} title="Sin juicio" text="Contás lo que pasó. Nos enfocamos en cuidarte y frenar el daño." />
            <Pill icon={HeartHandshake} title="Acompañamiento" text="Se activan intervenciones de comunicación positiva y seguimiento." />
          </div>
        </header>

        <main className="mt-8">
          <Tabs defaultValue="reportar">
            <TabsList className={cn("rounded-2xl p-1", "[#7c5a5a] border border-white/10")}>
              <TabsTrigger value="reportar">Comunicar</TabsTrigger>
              <TabsTrigger value="acompanamiento">Acompañamiento</TabsTrigger>
              <TabsTrigger value="recursos">Recursos</TabsTrigger>
            </TabsList>

            <TabsContent value="reportar" className="mt-5">
              <div className="grid lg:grid-cols-5 gap-4">
                <Card className={cn(glass, "rounded-3xl lg:col-span-3")}>
                  <CardHeader>
                    <CardTitle className="text-white">Contá lo que pasó</CardTitle>
                    <CardDescription className="text-white/70">Lo importante: seguridad, claridad y que alguien pueda ayudarte.</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold">Comunicación anónima</div>
                          <div className="text-sm text-white/70">Activado por defecto. Podés dejar un contacto si querés.</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-white/70">{anonymous ? "Sí" : "No"}</span>
                          <Switch checked={anonymous} onChange={setAnonymous} />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <Checkbox checked={contactOk} onChange={setContactOk} />
                        <div className="text-sm text-white/75">Quiero que me contacten para acompañarme</div>
                      </div>

                      <AnimatePresence>
                        {!anonymous && contactOk && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 grid md:grid-cols-2 gap-3"
                          >
                            <div className="space-y-2">
                              <Label className="text-white/80">Nombre</Label>
                              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white/80">Email o contacto</Label>
                              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mail@… o teléfono" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!anonymous && !contactOk && <div className="mt-3 text-xs text-white/60">Tip: si preferís no dar datos, podés seguir anónimo/a.</div>}
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-white/80">Curso / año</Label>
                        <SelectNative value={course} onChange={setCourse} options={grades} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/80">¿Dónde?</Label>
                        <SelectNative value={location} onChange={setLocation} options={locations} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/80">¿Cuándo?</Label>
                        <Input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="Hoy / Ayer / Fecha" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80">¿Qué tipo de situación fue?</Label>
                      <div className="flex flex-wrap gap-2">
                        {chips.map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => toggleTag(t)}
                            className={cn(
                              "rounded-full px-3 py-1 text-sm border transition",
                              what.includes(t) ? "bg-white/20 border-white/30 text-white" : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <div className="text-xs text-white/60">Podés marcar más de una.</div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80">Contanos con tus palabras</Label>
                      <Textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="¿Qué pasó? ¿Quiénes estaban? ¿Hay testigos? ¿Cómo te sentiste? ¿Qué necesitás ahora?"
                        className="min-h-[140px]"
                      />
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox checked={evidence} onChange={setEvidence} />
                          <div className="text-sm text-white/75">Tengo evidencia (capturas, mensajes, etc.)</div>
                          <Button variant="secondary" disabled className="rounded-2xl">
                            <Upload className="h-4 w-4" /> Subir (demo)
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox checked={danger} onChange={setDanger} />
                          <div className="text-sm text-white/75">Hay riesgo inmediato</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="rounded-2xl flex-1"
                        disabled={!canSend}
                        onClick={() => {
                          setSent(true);
                        }}
                      >
                        Enviar comunicación <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" className="rounded-2xl" onClick={reset}>
                        Limpiar
                      </Button>
                    </div>

                    <AnimatePresence>
                      {sent && (
                        <ToastLike
                          icon={danger ? AlertTriangle : CheckCircle2}
                          title={summary.title}
                          body={
                            danger
                              ? "Gracias por avisar. Si hay peligro inmediato, buscá a un adulto ya. Este canal activa seguimiento, pero lo urgente va primero."
                              : "Gracias por contar lo que pasó. En un sitio real, esto se enviaría al Equipo de Convivencia para intervención y acompañamiento."
                          }
                        />
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                  <Card className={cn(glass, "rounded-3xl")}>
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Shield className="h-5 w-5" /> Qué pasa después
                      </CardTitle>
                      <CardDescription className="text-white/70">Para que la escuela actúe con rapidez y cuidado.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Step n={1} title="Se registra y se evalúa el riesgo" text="Se revisa la comunicación, se prioriza si hay urgencia y se cuida la confidencialidad." />
                      <Step n={2} title="Intervención" text="Se activan adultos referentes, mediación o medidas de protección según el caso." />
                      <Step n={3} title="Comunicación positiva" text="Se trabaja con mensajes y acuerdos para reparar, frenar la agresión y sostener a quien fue afectado/a." />
                      <Step n={4} title="Seguimiento" text="No termina en una charla: se monitorea y se acompaña en el tiempo." />
                    </CardContent>
                  </Card>

                  <Card className={cn(glass, "rounded-3xl")}>
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Phone className="h-5 w-5" /> Si es urgente
                      </CardTitle>
                      <CardDescription className="text-white/70">Primero la seguridad.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-white/75 leading-relaxed">
                      <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                        Si vos o alguien corre peligro inmediato, buscá a un adulto ahora.
                        <div className="mt-2 text-white/70">
                          En Argentina: ante una emergencia, llamá al <span className="font-semibold text-white">911</span>.
                        </div>
                      </div>
                      <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                        Si hay ciberbullying, no difundas. Guardá capturas y pedí ayuda.
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="acompanamiento" className="mt-5">
              <div className="grid lg:grid-cols-2 gap-4">
                <PositiveNudges />

                <Card className={cn(glass, "rounded-3xl")}>
                  <CardHeader>
                    <CardTitle className="text-white">Checklist para pedir ayuda</CardTitle>
                    <CardDescription className="text-white/70">Rápido, simple, accionable.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-white/75">
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      ✅ Decí a un adulto: <span className="font-semibold">qué pasó</span>, <span className="font-semibold">dónde</span>, <span className="font-semibold">cuándo</span>.
                    </div>
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      ✅ Si fue online: guardá evidencia (capturas) y pedí a un adulto que acompañe.
                    </div>
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      ✅ Si sos testigo: acercate a la persona afectada y ofrecé compañía.
                    </div>
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      ✅ No te culpes: pedir ayuda es una forma de cuidado.
                    </div>

                    <Separator />

                    <div className="text-white/70 leading-relaxed">
                      Nota para la escuela: este prototipo está pensado para integrarse con un tablero interno (casos, prioridad,
                      estado, acciones, evidencia y seguimiento) y mensajes modelo de comunicación positiva.
                    </div>

                    <Disclosure
                      buttonLabel="Ver ejemplo de tablero (demo)"
                      title="Ejemplo de tablero para la escuela (idea)"
                      description="Solo para visualizar. No incluye datos reales."
                    >
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="font-semibold">Nuevos</div>
                          <div className="text-white/70">Triage, riesgo, asignación.</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="font-semibold">En intervención</div>
                          <div className="text-white/70">Medidas, entrevistas, mediación.</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="font-semibold">Seguimiento</div>
                          <div className="text-white/70">Check-ins, acuerdos, evaluación.</div>
                        </div>
                        <div className="md:col-span-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="font-semibold">Campos recomendados</div>
                          <div className="text-white/70 mt-1">
                            Fecha • Lugar • Tipología • Evidencia • Riesgo • Persona referente • Acciones • Próximo contacto • Estado • Observaciones
                          </div>
                        </div>
                      </div>
                    </Disclosure>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recursos" className="mt-5">
              <div className="grid lg:grid-cols-3 gap-4">
                <Card className={cn(glass, "rounded-3xl lg:col-span-2")}>
                  <CardHeader>
                    <CardTitle className="text-white">Guía rápida</CardTitle>
                    <CardDescription className="text-white/70">Qué hacer hoy, sin esperar.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-3">
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      <div className="font-semibold text-white/95">Si te pasa a vos</div>
                      <ul className="mt-2 text-sm text-white/75 space-y-1 list-disc pl-5">
                        <li>Contale a un adulto de confianza.</li>
                        <li>Guardá evidencia si fue online.</li>
                        <li>No respondas con violencia: buscá apoyo.</li>
                      </ul>
                    </div>
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      <div className="font-semibold text-white/95">Si sos testigo</div>
                      <ul className="mt-2 text-sm text-white/75 space-y-1 list-disc pl-5">
                        <li>Acercate y acompañá a la persona.</li>
                        <li>Pedí ayuda a un adulto / preceptoría.</li>
                        <li>No difundas contenido dañino.</li>
                      </ul>
                    </div>
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      <div className="font-semibold text-white/95">Si estás en redes</div>
                      <ul className="mt-2 text-sm text-white/75 space-y-1 list-disc pl-5">
                        <li>Bloqueá y reportá cuentas agresoras.</li>
                        <li>Guardá capturas.</li>
                        <li>Pedí ayuda adulta para denunciar.</li>
                      </ul>
                    </div>
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      <div className="font-semibold text-white/95">Para la escuela (nota)</div>
                      <div className="mt-2 text-sm text-white/75 leading-relaxed">
                        Integrar con protocolo institucional: registro, triage, medidas de protección, comunicación positiva y seguimiento.
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn(glass, "rounded-3xl")}>
                  <CardHeader>
                    <CardTitle className="text-white">Privacidad</CardTitle>
                    <CardDescription className="text-white/70">Lo mínimo necesario para cuidar.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-white/75">
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      <div className="font-semibold">Principios</div>
                      <ul className="mt-2 space-y-1 list-disc pl-5">
                        <li>Datos mínimos</li>
                        <li>Acceso por rol</li>
                        <li>Seguimiento con registro</li>
                        <li>Retención limitada</li>
                      </ul>
                    </div>
                    <div className={cn("rounded-2xl p-4", "bg-[#5A4033]/50 border border-white/15")}>
                      <div className="font-semibold">En este prototipo</div>
                      <div className="mt-2">No se envía nada: todo se queda en tu navegador.</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="mt-10 text-sm text-white/60">
          <Separator />
          <div className="pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              Prototipo UI • Canal de comunicación y acompañamiento • <span className="text-white/70">No reemplaza una emergencia</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Confidencialidad por diseño</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
