export interface ESPDeviceInfo {
  ipAddress: string
  deviceName: string
  firmwareVersion: string
  connectedAt: string
}

export async function verifyESPConnection(ipAddress: string): Promise<ESPDeviceInfo> {
  try {
    const response = await fetch(`http://${ipAddress}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error("ESP32 device did not respond with ACK")
    }

    const data = await response.json()

    return {
      ipAddress,
      deviceName: data.deviceName || "ESP32 Water Controller",
      firmwareVersion: data.firmwareVersion || "v1.0.0",
      connectedAt: new Date().toISOString(),
    }
  } catch (error) {
    throw new Error(`Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export function getStoredESPConnection(): ESPDeviceInfo | null {
  if (typeof window === "undefined") return null

  const isConnected = localStorage.getItem("espConnected")
  const ipAddress = localStorage.getItem("espIP")
  const connectedAt = localStorage.getItem("espConnectionTime")

  if (!isConnected || !ipAddress) return null

  return {
    ipAddress,
    deviceName: localStorage.getItem("espDeviceName") || "ESP32 Water Controller",
    firmwareVersion: localStorage.getItem("espFirmwareVersion") || "v1.0.0",
    connectedAt: connectedAt || new Date().toISOString(),
  }
}

export function clearESPConnection(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("espIP")
  localStorage.removeItem("espConnected")
  localStorage.removeItem("espConnectionTime")
  localStorage.removeItem("espDeviceName")
  localStorage.removeItem("espFirmwareVersion")
}
