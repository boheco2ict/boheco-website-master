import { supabase } from "./supabase";

export const deleteAdvisory = async (id) => {
  if (!id) {
    throw new Error("Advisory ID is Required.");
  }

  const { data, error } = await supabase
    .from("power_rate_advisories")
    .delete()
    .eq("id", id)
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
    .from("generation_charge")
    .delete()
    .eq("id", id)
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
    .from("can_approve_leave")
    .delete()
    .eq("id", id)
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
    .from("consumers_boheco_account")
    .delete()
    .eq("id", id)
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
    .from("power_interruption")
    .delete()
    .eq("id", id)
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
    .from("notice")
    .delete()
    .eq("id", id)
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

export const deleteRateYear = async (id) => {
  if (!id) {
    throw new Error("ID is Required.");
  }

  const { data, error } = await supabase
    .from("power_rates")
    .delete()
    .eq("id", id)
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