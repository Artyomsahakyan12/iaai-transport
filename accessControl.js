async function deviceIDExists() {
  const deviceID = localStorage.getItem("pulseAutoImportdeviceID");
  if (!deviceID) return false
  const response = await checkdeviceIDInSupabase(deviceID)
  return response.exists
}

async function deviceIDStatus() {
  const deviceID = localStorage.getItem("pulseAutoImportdeviceID");
  if (!deviceID) return "not_found"
  const response = await checkdeviceIDInSupabase(deviceID)
  return response.status
}
async function checkdeviceIDInSupabase(deviceID) {
  try {
    const response = await fetch(SUPABASE_EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "check",
        device_id: deviceID
      })
    });

    if (!response.ok) throw new Error(`Supabase request failed: ${response.status}`)

    const result = await response.json();

    return {
      exists: result.exists === true,
      status: result.status ?? "unknown"
    };
  } catch (error) {
    console.error("Error checking deviceID:", error);

    return {
      exists: false,
      status: "error"
    };
  }
}
