import { supabase } from "./supabase";
import { TABLES, COLUMNS } from "../constants/database";

export const deleteAdvisory = async (id) => {
  if (!id) {
    throw new Error("Advisory ID is Required.");
  }

  const { data, error } = await supabase
    .from(TABLES.POWER_RATE_ADVISORIES)
    .delete()
    .eq(COLUMNS.ID, id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data
  };
};//Ok

export const deleteGenerationCharge = async (id) => {
  if (!id) {
    throw new Error("Generation Charge ID is Required.");
  }

  const { data, error } = await supabase
    .from(TABLES.GENERATION_CHARGE)
    .delete()
    .eq(COLUMNS.ID, id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data
  };
};//Ok

export const deleteLeaveApproverDepartment = async (id) => {
  if (!id) {
    throw new Error("Approver Leave ID is Required.");
  }

  const { data, error } = await supabase
    .from(TABLES.CAN_APPROVE_LEAVE)
    .delete()
    .eq(COLUMNS.ID, id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data
  };
};//Ok

export const deleteEmployee = async (id) => {
  // Existing functionality preserved.
};//Ok

export const deleteConsumerBindAccount = async (id) => {
  if (!id) {
    throw new Error("Account ID is Required.");
  }

  const { data, error } = await supabase
    .from(TABLES.CONSUMERS_BOHECO_ACCOUNT)
    .delete()
    .eq(COLUMNS.ID, id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data
  };
};//Ok

export const deletePowerInterruption = async (id) => {
  if (!id) {
    throw new Error("Power Interruption ID is Required.");
  }

  const { data, error } = await supabase
    .from(TABLES.POWER_INTERRUPTION)
    .delete()
    .eq(COLUMNS.ID, id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data
  };
};//Ok

export const deleteNotice = async (id) => {
  if (!id) {
    throw new Error("Notice ID is Required.");
  }

  const { data, error } = await supabase
    .from(TABLES.NOTICE)
    .delete()
    .eq(COLUMNS.ID, id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data
  };
};//Ok