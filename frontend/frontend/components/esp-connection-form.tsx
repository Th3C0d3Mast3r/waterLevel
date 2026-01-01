// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"

// interface ESPConnectionFormProps {
//   isConnected: boolean
//   onSuccess: () => void
// }

// export function ESPConnectionForm({ isConnected, onSuccess }: ESPConnectionFormProps) {
//   const [ipAddress, setIpAddress] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [connectionDetails, setConnectionDetails] = useState<{
//     deviceName: string
//     firmwareVersion: string
//     lastSync: string
//   } | null>(null)

//   const validateIP = (ip: string): boolean => {
//     const ipv4Regex =
//       /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
//     return ipv4Regex.test(ip)
//   }

//   const handleConnect = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")

//     if (!ipAddress.trim()) {
//       setError("Please enter an IP address")
//       return
//     }

//     if (!validateIP(ipAddress)) {
//       setError("Invalid IP address format. Use format: 192.168.x.x")
//       return
//     }

//     setIsLoading(true)

//     try {
//       // Simulate API call to ESP32
//       const response = await fetch(`http://${ipAddress}/health`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         signal: AbortSignal.timeout(5000),
//       })

//       if (!response.ok) {
//         throw new Error("Device did not respond")
//       }

//       const data = await response.json()

//       // Simulate receiving ACK with device details
//       setConnectionDetails({
//         deviceName: data.deviceName || "ESP32 Water Controller",
//         firmwareVersion: data.firmwareVersion || "v1.0.0",
//         lastSync: new Date().toLocaleTimeString(),
//       })

//       // Store connection in localStorage
//       localStorage.setItem("espIP", ipAddress)
//       localStorage.setItem("espConnected", "true")
//       localStorage.setItem("espConnectionTime", new Date().toISOString())

//       setIsLoading(false)

//       // Trigger success callback after brief delay to show details
//       setTimeout(() => {
//         onSuccess()
//       }, 2000)
//     }
//     catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to connect to ESP32"
//       setError(errorMessage)
//       setConnectionDetails(null)
//       setIsLoading(false)
//     }
//   }

//   if (connectionDetails && !isLoading) {
//     return (
//       <div className="space-y-4 p-6 rounded-xl bg-card border border-border/50">
//         <div className="flex items-center gap-3">
//           <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
//           <h3 className="font-semibold text-foreground">Device Connected</h3>
//         </div>

//         <div className="space-y-3 bg-muted/30 rounded-lg p-4">
//           <div className="flex justify-between items-center">
//             <span className="text-sm text-muted-foreground">Device Name</span>
//             <span className="text-sm font-medium text-foreground">{connectionDetails.deviceName}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-sm text-muted-foreground">IP Address</span>
//             <span className="text-sm font-medium text-foreground">{ipAddress}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-sm text-muted-foreground">Firmware</span>
//             <span className="text-sm font-medium text-foreground">{connectionDetails.firmwareVersion}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-sm text-muted-foreground">Last Sync</span>
//             <span className="text-sm font-medium text-foreground">{connectionDetails.lastSync}</span>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <form onSubmit={handleConnect} className="space-y-5 p-6 rounded-xl bg-card border border-border/50">
//       <div className="space-y-2">
//         <label htmlFor="ip" className="block text-sm font-medium text-foreground">
//           ESP32 IP Address
//         </label>
//         <Input
//           id="ip"
//           type="text"
//           placeholder="192.168.1.100"
//           value={ipAddress}
//           onChange={(e) => setIpAddress(e.target.value)}
//           disabled={isLoading}
//           className="font-mono"
//         />
//       </div>

//       {error && (
//         <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
//           <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
//           <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
//         </div>
//       )}

//       <Button type="submit" disabled={isLoading || !ipAddress} className="w-full" size="lg">
//         {isLoading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Connecting...
//           </>
//         ) : (
//           "Verify Connection"
//         )}
//       </Button>

//       <p className="text-xs text-muted-foreground text-center pt-2">
//         Your ESP32 will receive an ACK request. It must respond within 5 seconds.
//       </p>
//     </form>
//   )
// }
