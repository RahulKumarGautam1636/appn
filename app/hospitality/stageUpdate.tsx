import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, Platform } from "react-native";
import { X, ChevronDown, Phone, Layers, MessageSquare, Check, Sparkles, Calendar, Clock, IndianRupee, Send } from "lucide-react-native";


const STAGES = [
  { label: "Registration", color: "#6366f1" },
  { label: "Verification", color: "#8b5cf6" },
  { label: "Onboarding",   color: "#a78bfa" },
  { label: "Active",       color: "#10b981" },
  { label: "Follow-up",    color: "#f59e0b" },
  { label: "Closed",       color: "#ef4444" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (stage: string, remarks: string) => void;
  name?: string;
  phone?: string;
}

export function UpdateStage({
  visible,
  onClose,
  onSave,
  name = "Minakshi Singh",
  phone = "8563290982",
}: Props) {
  const [selectedStage, setSelectedStage] = useState(STAGES[0]);
  const [remarks, setRemarks]           = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saved, setSaved]               = useState(false);

  const ac = selectedStage.color;

  const handleSave = () => {
    if (!remarks.trim()) return;
    setSaved(true);
    setTimeout(() => {
      onSave(selectedStage.label, remarks);
      onClose();
      setRemarks("");
      setSaved(false);
    }, 600);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <View className="flex-1 bg-black/40 justify-end">
      <Pressable className="flex-1" onPress={onClose} />
      <View style={{ paddingBottom: 20 }} className="bg-white rounded-t-3xl">
        {/* Drag pill */}
        <View className="w-10 h-1 rounded-full bg-gray-200 self-center mt-3 mb-1" />

        {/* ── Header ── */}
        <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
          {/* Avatar */}
          <View
            style={{ backgroundColor: ac + "18", borderColor: ac + "40" }}
            className="w-12 h-12 rounded-2xl items-center justify-center border-2 mr-3"
          >
            <Text
              style={{ color: ac }}
              className="text-base font-bold tracking-wider"
            >
              {initials}
            </Text>
          </View>

          {/* Name & phone */}
          <View className="flex-1">
            <Text className="text-gray-900 text-[15px] font-bold">{name}</Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <Phone size={11} color="#9ca3af" strokeWidth={2} />
              <Text className="text-gray-400 text-xs font-medium">{phone}</Text>
            </View>
          </View>

          {/* Stage badge */}
          <View
            style={{ backgroundColor: ac + "18", borderColor: ac + "40" }}
            className="px-2.5 py-1 rounded-full border mr-2"
          >
            <Text
              style={{ color: ac }}
              className="text-[10px] font-extrabold tracking-widest uppercase"
            >
              {selectedStage.label}
            </Text>
          </View>

          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="w-8 h-8 rounded-xl bg-gray-100 items-center justify-center"
          >
            <X size={15} color="#6b7280" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* ── Body ── */}
        <View className="px-5 pt-5">
          {/* Stage label */}
          <View className="flex-row items-center gap-1.5 mb-2">
            <Layers size={13} color={ac} strokeWidth={2} />
            <Text className="text-gray-500 text-[10px] font-extrabold tracking-widest uppercase">
              Update Stage
            </Text>
            <View className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1" />
          </View>

          {/* Dropdown trigger */}
          <TouchableOpacity
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.75}
            style={{ borderColor: dropdownOpen ? ac : "#e5e7eb" }}
            className="flex-row items-center justify-between bg-gray-50 border-2 rounded-2xl px-4 py-3.5"
          >
            <View className="flex-row items-center gap-2.5">
              <View
                style={{ backgroundColor: ac }}
                className="w-2.5 h-2.5 rounded-full"
              />
              <Text className="text-gray-800 text-sm font-semibold">
                {selectedStage.label}
              </Text>
            </View>
            <ChevronDown
              size={17}
              color="#9ca3af"
              strokeWidth={2.5}
              style={{
                transform: [{ rotate: dropdownOpen ? "180deg" : "0deg" }],
              }}
            />
          </TouchableOpacity>

          {/* Dropdown list */}
          {dropdownOpen && (
            <View className="border border-gray-100 rounded-2xl mt-1.5 bg-white overflow-hidden shadow-sm shadow-gray-200">
              {STAGES.map((stage, idx) => (
                <TouchableOpacity
                  key={stage.label}
                  onPress={() => {
                    setSelectedStage(stage);
                    setDropdownOpen(false);
                  }}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor:
                      selectedStage.label === stage.label
                        ? stage.color + "12"
                        : "transparent",
                    borderBottomWidth: idx < STAGES.length - 1 ? 1 : 0,
                    borderBottomColor: "#f3f4f6",
                  }}
                  className="flex-row items-center justify-between px-4 py-3.5"
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      style={{ backgroundColor: stage.color }}
                      className="w-2.5 h-2.5 rounded-full"
                    />
                    <Text
                      style={{
                        color:
                          selectedStage.label === stage.label
                            ? stage.color
                            : "#6b7280",
                      }}
                      className={`text-sm ${
                        selectedStage.label === stage.label
                          ? "font-semibold"
                          : "font-normal"
                      }`}
                    >
                      {stage.label}
                    </Text>
                  </View>
                  {selectedStage.label === stage.label && (
                    <Check size={14} color={stage.color} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Remarks label */}
          <View className="flex-row items-center gap-1.5 mt-5 mb-2">
            <MessageSquare size={13} color={ac} strokeWidth={2} />
            <Text className="text-gray-500 text-[10px] font-extrabold tracking-widest uppercase">
              Today's Remarks
            </Text>
            <View className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1" />
          </View>

          {/* Remarks input */}
          <TextInput
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Write your notes here..."
            placeholderTextColor="#d1d5db"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              borderColor: remarks ? ac + "80" : "#e5e7eb",
              minHeight: 100,
              lineHeight: 22,
            }}
            className="bg-gray-50 border-2 rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
          />

          {/* Char count */}
          {remarks.length > 0 && (
            <Text className="text-gray-300 text-xs text-right mt-1.5 font-medium">
              {remarks.length} chars
            </Text>
          )}

          {/* ── Buttons ── */}
          <View className="flex-row gap-3 mt-6">
            {/* Cancel */}
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="flex-1 py-4 rounded-2xl items-center justify-center bg-gray-100"
            >
              <Text className="text-gray-500 text-sm font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>

            {/* Save */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={!remarks.trim() || saved}
              activeOpacity={0.8}
              style={{
                backgroundColor: !remarks.trim() ? ac + "50" : ac,
                shadowColor: ac,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: remarks.trim() ? 0.35 : 0,
                shadowRadius: 10,
                elevation: remarks.trim() ? 6 : 0,
              }}
              className="flex-[2] py-4 rounded-2xl items-center justify-center flex-row gap-2"
            >
              {saved ? (
                <Check size={18} color="#fff" strokeWidth={3} />
              ) : (
                <>
                  <Sparkles size={14} color="#fff" strokeWidth={2.5} />
                  <Text className="text-white text-sm font-bold tracking-wide">
                    Save Changes
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Types ──────────────────────────────────────────────
interface Particular {
  id: string;
  label: string;
  amount: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

// ── Static data ────────────────────────────────────────
const INITIAL_PARTICULARS: Particular[] = [
  { id: "1", label: "HIV I & II",  amount: "400" },
  { id: "2", label: "USG chest",   amount: "500" },
  { id: "3", label: "USG WALL",    amount: "600" },
];

const DEPT_OPTIONS: DropdownOption[] = [
  { label: "INVESTIGATION", value: "investigation" },
  { label: "CONSULTATION",  value: "consultation"  },
  { label: "RADIOLOGY",     value: "radiology"     },
  { label: "PATHOLOGY",     value: "pathology"     },
];

const STAGE_OPTIONS: DropdownOption[] = [
  { label: "Lab Test Booking", value: "lab_test"    },
  { label: "Registration",     value: "registration"},
  { label: "Verification",     value: "verification"},
  { label: "Active",           value: "active"      },
  { label: "Follow-up",        value: "followup"    },
  { label: "Closed",           value: "closed"      },
];

const REFER_OPTIONS: DropdownOption[] = [
  { label: "Select User",  value: ""         },
  { label: "Dr. Sharma",   value: "sharma"   },
  { label: "Dr. Mehta",    value: "mehta"    },
  { label: "Dr. Verma",    value: "verma"    },
];

// ── Reusable Dropdown ──────────────────────────────────
function Dropdown({
  options,
  selected,
  onSelect,
  placeholder = "Select",
  accentColor = "#6366f1",
}: {
  options: DropdownOption[];
  selected: DropdownOption | null;
  onSelect: (opt: DropdownOption) => void;
  placeholder?: string;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const label = selected?.label ?? placeholder;

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        activeOpacity={0.75}
        style={{ borderColor: open ? accentColor : "#e5e7eb" }}
        className="flex-row items-center justify-between bg-gray-50 border-2 rounded-2xl px-3.5 py-3"
      >
        <Text
          style={{ color: selected ? "#1f2937" : "#9ca3af" }}
          className="text-sm font-semibold flex-1 mr-1"
          numberOfLines={1}
        >
          {label}
        </Text>
        <ChevronDown
          size={15}
          color={open ? accentColor : "#9ca3af"}
          strokeWidth={2.5}
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {open && (
        <View
          className="absolute left-0 right-0 bg-white border border-gray-100 rounded-2xl overflow-hidden z-50"
          style={{ top: "105%", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, elevation: 8 }}
        >
          {options.map((opt, idx) => {
            const isSelected = selected?.value === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => { onSelect(opt); setOpen(false); }}
                activeOpacity={0.7}
                style={{
                  backgroundColor: isSelected ? accentColor + "12" : "transparent",
                  borderBottomWidth: idx < options.length - 1 ? 1 : 0,
                  borderBottomColor: "#f3f4f6",
                }}
                className="flex-row items-center justify-between px-4 py-3"
              >
                <Text
                  style={{ color: isSelected ? accentColor : "#6b7280" }}
                  className={`text-sm ${isSelected ? "font-semibold" : "font-normal"}`}
                >
                  {opt.label}
                </Text>
                {isSelected && <Check size={13} color={accentColor} strokeWidth={2.5} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ── Section Divider ────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3 my-5">
      <View className="flex-1 h-px bg-indigo-200" />
      <Text className="text-indigo-500 text-xs font-extrabold tracking-widest uppercase px-1">
        {label}
      </Text>
      <View className="flex-1 h-px bg-indigo-200" />
    </View>
  );
}

// ── Field label ────────────────────────────────────────
function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <View className="flex-row items-center mb-1.5">
      <Text className="text-gray-500 text-xs font-bold tracking-wide">{label}</Text>
      {required && <Text className="text-red-400 ml-0.5 text-xs font-bold">*</Text>}
    </View>
  );
}

// ── Main Component ─────────────────────────────────────
interface Props {
  onSubmit?: (data: object) => void;
}

export default function ParticularsForm({ onSubmit }: Props) {
  const [particulars, setParticulars]     = useState<Particular[]>(INITIAL_PARTICULARS);
  const [remarks, setRemarks]             = useState("");
  const [date, setDate]                   = useState("");
  const [time, setTime]                   = useState("12:25 PM");
  const [dept, setDept]                   = useState<DropdownOption>(DEPT_OPTIONS[0]);
  const [stage, setStage]                 = useState<DropdownOption>(STAGE_OPTIONS[0]);
  const [referTo, setReferTo]             = useState<DropdownOption | null>(null);

  const updateAmount = (id: string, value: string) => {
    setParticulars((prev) =>
      prev.map((p) => (p.id === id ? { ...p, amount: value } : p))
    );
  };

  const total = particulars.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const handleSubmit = () => {
    onSubmit?.({ particulars, remarks, date, time, dept, stage, referTo });
  };

  const ac = "#6366f1"; // primary accent

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 48 : 32 }}
      keyboardShouldPersistTaps="handled"
    >
      <UpdateStage />
      <View className="px-4 pt-5">
        {/* ── Particulars Card ── */}
        <View
          className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-1"
          style={{
            shadowColor: "#6366f1",
            shadowOpacity: 0.06,
            shadowRadius: 16,
            elevation: 3,
          }}
        >
          {/* Card header */}
          <View className="px-5 pt-4 pb-3 border-b border-gray-50">
            <Text className="text-gray-900 text-base font-extrabold tracking-tight">
              Particulars
            </Text>
          </View>

          {/* Rows */}
          {particulars.map((item, idx) => (
            <View
              key={item.id}
              style={{
                borderBottomWidth: idx < particulars.length - 1 ? 1 : 0,
                borderBottomColor: "#f3f4f6",
              }}
              className="flex-row items-center px-5 py-3.5"
            >
              <Text className="flex-1 text-gray-700 text-sm font-semibold">
                {item.label}
              </Text>

              {/* Amount input with ₹ prefix */}
              <View
                style={{ borderColor: "#e5e7eb" }}
                className="flex-row items-center border-2 rounded-xl overflow-hidden bg-indigo-50/60"
              >
                <View className="px-2.5 py-2 bg-indigo-50 border-r border-indigo-100">
                  <IndianRupee size={13} color={ac} strokeWidth={2.5} />
                </View>
                <TextInput
                  value={item.amount}
                  onChangeText={(v) =>
                    updateAmount(item.id, v.replace(/[^0-9.]/g, ""))
                  }
                  keyboardType="numeric"
                  style={{ width: 72, textAlign: "right" }}
                  className="px-3 py-2 text-gray-800 text-sm font-bold"
                />
              </View>
            </View>
          ))}

          {/* Total row */}
          <View className="flex-row items-center justify-between px-5 py-3.5 bg-indigo-50/60 border-t border-indigo-100">
            <Text className="text-indigo-600 text-xs font-extrabold tracking-widest uppercase">
              Total
            </Text>
            <View className="flex-row items-center gap-1">
              <IndianRupee size={13} color={ac} strokeWidth={2.5} />
              <Text style={{ color: ac }} className="text-base font-extrabold">
                {total.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Today's Remarks ── */}
        <View className="mt-5">
          <FieldLabel label="Todays Remarks" required />
          <TextInput
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter remarks..."
            placeholderTextColor="#d1d5db"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              borderColor: remarks ? ac + "80" : "#e5e7eb",
              height: 80,
              lineHeight: 22,
            }}
            className="bg-white border-2 rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
          />
        </View>

        {/* ── Next Followup Divider ── */}
        <SectionDivider label="Next Followup Details" />

        {/* Date + Time row */}
        <View className="flex-row gap-3 mb-4">
          {/* Date */}
          <View className="flex-1">
            <FieldLabel label="Date" required />
            <TouchableOpacity
              activeOpacity={0.75}
              style={{ borderColor: "#e5e7eb" }}
              className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3"
            >
              <Text
                className={`text-sm font-semibold ${
                  date ? "text-gray-800" : "text-gray-300"
                }`}
              >
                {date || "Date"}
              </Text>
              <Calendar size={16} color={ac} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Time */}
          <View className="flex-1">
            <FieldLabel label="Time" />
            <TouchableOpacity
              activeOpacity={0.75}
              style={{ borderColor: "#e5e7eb" }}
              className="flex-row items-center justify-between bg-white border-2 rounded-2xl px-3.5 py-3"
            >
              <Text className="text-gray-800 text-sm font-semibold">
                {time}
              </Text>
              <Clock size={16} color={ac} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dept + Stage row */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <FieldLabel label="Dept." required />
            <Dropdown
              options={DEPT_OPTIONS}
              selected={dept}
              onSelect={setDept}
              accentColor={ac}
            />
          </View>
          <View className="flex-1">
            <FieldLabel label="Stage" required />
            <Dropdown
              options={STAGE_OPTIONS}
              selected={stage}
              onSelect={setStage}
              accentColor={ac}
            />
          </View>
        </View>

        {/* Refer To */}
        <View className="mb-6">
          <FieldLabel label="Refer To" />
          <Dropdown
            options={REFER_OPTIONS}
            selected={referTo}
            onSelect={(opt) => setReferTo(opt.value ? opt : null)}
            placeholder="Select User"
            accentColor={ac}
          />
        </View>

        {/* ── Submit Button ── */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.85}
          style={{
            backgroundColor: ac,
            shadowColor: ac,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 6,
          }}
          className="py-4 rounded-2xl items-center justify-center flex-row gap-2"
        >
          <Send size={15} color="#fff" strokeWidth={2.5} />
          <Text className="text-white text-sm font-bold tracking-wide">
            Submit Details
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}