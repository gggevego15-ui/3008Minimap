-- Place this Script in ServerScriptService in YOUR Roblox experience.
-- This reports positions only from your own experience. It cannot be inserted into someone else's game.
-- Set MINIMAP_TOKEN in the backend environment and paste the same value into TOKEN below.
-- Use HTTPS for REPORT_URL. Do not put this secret in a LocalScript or client UI.

local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")

local REPORT_URL = "https://YOUR-BACKEND-HOST.example/api/report"
local TOKEN = "REPLACE_WITH_YOUR_SERVER_TOKEN"
local INTERVAL_SECONDS = 5

local function mapCoordinate(value, minValue, maxValue)
    if maxValue <= minValue then
        return 50
    end
    return math.clamp(((value - minValue) / (maxValue - minValue)) * 100, 0, 100)
end

local function collectPlayers()
    local result = {}

    -- IMPORTANT: Set these bounds to the coordinate area of YOUR own map.
    -- These are example bounds, not verified coordinates for the official 3008 game.
    local minX, maxX = -500, 500
    local minZ, maxZ = -500, 500

    for _, player in ipairs(Players:GetPlayers()) do
        local character = player.Character
        local root = character and character:FindFirstChild("HumanoidRootPart")
        if root then
            table.insert(result, {
                id = tostring(player.UserId),
                name = player.Name,
                x = mapCoordinate(root.Position.X, minX, maxX),
                y = mapCoordinate(root.Position.Z, minZ, maxZ)
            })
        end
    end

    return result
end

while true do
    local payload = {
        players = collectPlayers()
    }

    local ok, response = pcall(function()
        return HttpService:RequestAsync({
            Url = REPORT_URL,
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json",
                ["Authorization"] = "Bearer " .. TOKEN
            },
            Body = HttpService:JSONEncode(payload)
        })
    end)

    if not ok then
        warn("[3008 Minimap] Position report failed. Check HttpService, URL, and network settings.")
    elseif not response.Success then
        warn("[3008 Minimap] Backend returned HTTP " .. tostring(response.StatusCode))
    end

    task.wait(INTERVAL_SECONDS)
end
