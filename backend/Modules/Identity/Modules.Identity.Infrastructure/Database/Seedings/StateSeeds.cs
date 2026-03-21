using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Infrastructure.Database.Seedings;

internal static class StateSeeds
{
    // Country IDs from CountrySeeds
    private static readonly Guid UnitedStates  = new("00000002-0000-0000-0000-000000000130");
    private static readonly Guid Canada        = new("00000002-0000-0000-0000-000000000028");
    private static readonly Guid France        = new("00000002-0000-0000-0000-000000000051");
    private static readonly Guid Germany       = new("00000002-0000-0000-0000-000000000055");
    private static readonly Guid UnitedKingdom = new("00000002-0000-0000-0000-000000000129");
    private static readonly Guid Tunisia       = new("00000002-0000-0000-0000-000000000125");
    private static readonly Guid India         = new("00000002-0000-0000-0000-000000000064");
    private static readonly Guid Australia     = new("00000002-0000-0000-0000-000000000008");
    private static readonly Guid Brazil        = new("00000002-0000-0000-0000-000000000021");
    private static readonly Guid Morocco       = new("00000002-0000-0000-0000-000000000086");
    private static readonly Guid Egypt         = new("00000002-0000-0000-0000-000000000046");
    private static readonly Guid SaudiArabia   = new("00000002-0000-0000-0000-000000000108");
    private static readonly Guid Turkey        = new("00000002-0000-0000-0000-000000000126");
    private static readonly Guid Spain         = new("00000002-0000-0000-0000-000000000116");
    private static readonly Guid Italy         = new("00000002-0000-0000-0000-000000000069");
    // Additional countries
    private static readonly Guid Algeria       = new("00000002-0000-0000-0000-000000000003");
    private static readonly Guid UAE           = new("00000002-0000-0000-0000-000000000128");
    private static readonly Guid Libya         = new("00000002-0000-0000-0000-000000000077");
    private static readonly Guid Iraq          = new("00000002-0000-0000-0000-000000000067");
    private static readonly Guid Jordan        = new("00000002-0000-0000-0000-000000000072");
    private static readonly Guid Lebanon       = new("00000002-0000-0000-0000-000000000076");
    private static readonly Guid Syria         = new("00000002-0000-0000-0000-000000000121");
    private static readonly Guid Sudan         = new("00000002-0000-0000-0000-000000000118");
    private static readonly Guid Yemen         = new("00000002-0000-0000-0000-000000000134");
    private static readonly Guid Qatar         = new("00000002-0000-0000-0000-000000000104");
    private static readonly Guid Kuwait        = new("00000002-0000-0000-0000-000000000075");
    private static readonly Guid Oman          = new("00000002-0000-0000-0000-000000000096");
    private static readonly Guid Bahrain       = new("00000002-0000-0000-0000-000000000011");
    private static readonly Guid Mexico        = new("00000002-0000-0000-0000-000000000085");
    private static readonly Guid Argentina     = new("00000002-0000-0000-0000-000000000006");
    private static readonly Guid SouthAfrica   = new("00000002-0000-0000-0000-000000000114");
    private static readonly Guid Nigeria       = new("00000002-0000-0000-0000-000000000094");
    private static readonly Guid Japan         = new("00000002-0000-0000-0000-000000000071");
    private static readonly Guid China         = new("00000002-0000-0000-0000-000000000033");
    private static readonly Guid Russia        = new("00000002-0000-0000-0000-000000000106");
    private static readonly Guid Pakistan      = new("00000002-0000-0000-0000-000000000097");
    private static readonly Guid Malaysia      = new("00000002-0000-0000-0000-000000000082");
    private static readonly Guid Poland        = new("00000002-0000-0000-0000-000000000102");
    private static readonly Guid Netherlands   = new("00000002-0000-0000-0000-000000000090");
    private static readonly Guid Belgium       = new("00000002-0000-0000-0000-000000000014");
    private static readonly Guid Portugal      = new("00000002-0000-0000-0000-000000000103");
    private static readonly Guid Greece        = new("00000002-0000-0000-0000-000000000057");
    private static readonly Guid Austria       = new("00000002-0000-0000-0000-000000000009");
    private static readonly Guid Bangladesh    = new("00000002-0000-0000-0000-000000000012");
    private static readonly Guid Indonesia     = new("00000002-0000-0000-0000-000000000065");
    private static readonly Guid Colombia      = new("00000002-0000-0000-0000-000000000034");
    private static readonly Guid Ukraine       = new("00000002-0000-0000-0000-000000000127");
    private static readonly Guid Iran          = new("00000002-0000-0000-0000-000000000066");
    private static readonly Guid Sweden        = new("00000002-0000-0000-0000-000000000119");
    private static readonly Guid Switzerland   = new("00000002-0000-0000-0000-000000000120");
    private static readonly Guid SouthKorea   = new("00000002-0000-0000-0000-000000000115");

    public static readonly State[] All =
    [
        // ── United States (50 states) ──────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000001"), "states.alabama",        UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000002"), "states.alaska",         UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000003"), "states.arizona",        UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000004"), "states.arkansas",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000005"), "states.california",     UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000006"), "states.colorado",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000007"), "states.connecticut",    UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000008"), "states.delaware",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000009"), "states.florida",        UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000010"), "states.georgia",        UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000011"), "states.hawaii",         UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000012"), "states.idaho",          UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000013"), "states.illinois",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000014"), "states.indiana",        UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000015"), "states.iowa",           UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000016"), "states.kansas",         UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000017"), "states.kentucky",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000018"), "states.louisiana",      UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000019"), "states.maine",          UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000020"), "states.maryland",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000021"), "states.massachusetts",  UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000022"), "states.michigan",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000023"), "states.minnesota",      UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000024"), "states.mississippi",    UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000025"), "states.missouri",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000026"), "states.montana",        UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000027"), "states.nebraska",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000028"), "states.nevada",         UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000029"), "states.newHampshire",   UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000030"), "states.newJersey",      UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000031"), "states.newMexico",      UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000032"), "states.newYork",        UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000033"), "states.northCarolina",  UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000034"), "states.northDakota",    UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000035"), "states.ohio",           UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000036"), "states.oklahoma",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000037"), "states.oregon",         UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000038"), "states.pennsylvania",   UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000039"), "states.rhodeIsland",    UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000040"), "states.southCarolina",  UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000041"), "states.southDakota",    UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000042"), "states.tennessee",      UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000043"), "states.texas",          UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000044"), "states.utah",           UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000045"), "states.vermont",        UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000046"), "states.virginia",       UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000047"), "states.washington",     UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000048"), "states.westVirginia",   UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000049"), "states.wisconsin",      UnitedStates),
        new(new Guid("00000003-0000-0000-0000-000000000050"), "states.wyoming",        UnitedStates),

        // ── Canada (13 provinces/territories) ─────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000051"), "states.alberta",                   Canada),
        new(new Guid("00000003-0000-0000-0000-000000000052"), "states.britishColumbia",            Canada),
        new(new Guid("00000003-0000-0000-0000-000000000053"), "states.manitoba",                   Canada),
        new(new Guid("00000003-0000-0000-0000-000000000054"), "states.newBrunswick",               Canada),
        new(new Guid("00000003-0000-0000-0000-000000000055"), "states.newfoundlandAndLabrador",    Canada),
        new(new Guid("00000003-0000-0000-0000-000000000056"), "states.novaScotia",                 Canada),
        new(new Guid("00000003-0000-0000-0000-000000000057"), "states.ontario",                    Canada),
        new(new Guid("00000003-0000-0000-0000-000000000058"), "states.princeEdwardIsland",         Canada),
        new(new Guid("00000003-0000-0000-0000-000000000059"), "states.quebec",                     Canada),
        new(new Guid("00000003-0000-0000-0000-000000000060"), "states.saskatchewan",               Canada),

        // ── France (13 metropolitan regions) ──────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000061"), "states.ileDefrance",          France),
        new(new Guid("00000003-0000-0000-0000-000000000062"), "states.provenceAlpesCoteDazur", France),
        new(new Guid("00000003-0000-0000-0000-000000000063"), "states.auvergneRhoneAlpes",    France),
        new(new Guid("00000003-0000-0000-0000-000000000064"), "states.nouvelleAquitaine",      France),
        new(new Guid("00000003-0000-0000-0000-000000000065"), "states.occitanie",              France),
        new(new Guid("00000003-0000-0000-0000-000000000066"), "states.hautsDefrance",          France),
        new(new Guid("00000003-0000-0000-0000-000000000067"), "states.grandEst",               France),
        new(new Guid("00000003-0000-0000-0000-000000000068"), "states.paysDeLaLoire",          France),
        new(new Guid("00000003-0000-0000-0000-000000000069"), "states.bretagne",               France),
        new(new Guid("00000003-0000-0000-0000-000000000070"), "states.normandie",              France),

        // ── Germany (16 federal states) ────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000071"), "states.badenWurttemberg",     Germany),
        new(new Guid("00000003-0000-0000-0000-000000000072"), "states.bavaria",              Germany),
        new(new Guid("00000003-0000-0000-0000-000000000073"), "states.berlin",               Germany),
        new(new Guid("00000003-0000-0000-0000-000000000074"), "states.hamburg",              Germany),
        new(new Guid("00000003-0000-0000-0000-000000000075"), "states.hesse",                Germany),
        new(new Guid("00000003-0000-0000-0000-000000000076"), "states.lowerSaxony",          Germany),
        new(new Guid("00000003-0000-0000-0000-000000000077"), "states.northRhineWestphalia", Germany),
        new(new Guid("00000003-0000-0000-0000-000000000078"), "states.rhinelandPalatinate",  Germany),
        new(new Guid("00000003-0000-0000-0000-000000000079"), "states.saxony",               Germany),

        // ── United Kingdom (4 nations) ─────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000080"), "states.england",         UnitedKingdom),
        new(new Guid("00000003-0000-0000-0000-000000000081"), "states.scotland",        UnitedKingdom),
        new(new Guid("00000003-0000-0000-0000-000000000082"), "states.wales",           UnitedKingdom),
        new(new Guid("00000003-0000-0000-0000-000000000083"), "states.northernIreland", UnitedKingdom),

        // ── Tunisia (24 governorates) ──────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000084"), "states.tunis",      Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000085"), "states.ariana",     Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000086"), "states.benArous",   Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000087"), "states.manouba",    Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000088"), "states.nabeul",     Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000089"), "states.zaghouan",   Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000090"), "states.bizerte",    Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000091"), "states.beja",       Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000092"), "states.jendouba",   Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000093"), "states.kef",        Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000094"), "states.siliana",    Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000095"), "states.sousse",     Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000096"), "states.monastir",   Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000097"), "states.mahdia",     Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000098"), "states.sfax",       Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000099"), "states.kairouan",   Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000100"), "states.kasserine",  Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000101"), "states.sidiBouzid", Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000102"), "states.gabes",      Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000103"), "states.medenine",   Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000104"), "states.tataouine",  Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000105"), "states.gafsa",      Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000106"), "states.tozeur",     Tunisia),
        new(new Guid("00000003-0000-0000-0000-000000000107"), "states.kebili",     Tunisia),

        // ── India (28 states + key UTs) ────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000108"), "states.maharashtra",  India),
        new(new Guid("00000003-0000-0000-0000-000000000109"), "states.karnataka",    India),
        new(new Guid("00000003-0000-0000-0000-000000000110"), "states.tamilNadu",    India),
        new(new Guid("00000003-0000-0000-0000-000000000111"), "states.delhi",        India),
        new(new Guid("00000003-0000-0000-0000-000000000112"), "states.uttarPradesh", India),
        new(new Guid("00000003-0000-0000-0000-000000000113"), "states.westBengal",   India),
        new(new Guid("00000003-0000-0000-0000-000000000114"), "states.rajasthan",    India),
        new(new Guid("00000003-0000-0000-0000-000000000115"), "states.gujarat",      India),
        new(new Guid("00000003-0000-0000-0000-000000000116"), "states.kerala",       India),
        new(new Guid("00000003-0000-0000-0000-000000000117"), "states.telangana",    India),

        // ── Australia (6 states + 2 territories) ──────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000118"), "states.newSouthWales",    Australia),
        new(new Guid("00000003-0000-0000-0000-000000000119"), "states.victoria",         Australia),
        new(new Guid("00000003-0000-0000-0000-000000000120"), "states.queensland",       Australia),
        new(new Guid("00000003-0000-0000-0000-000000000121"), "states.westernAustralia", Australia),
        new(new Guid("00000003-0000-0000-0000-000000000122"), "states.southAustralia",   Australia),
        new(new Guid("00000003-0000-0000-0000-000000000123"), "states.tasmania",         Australia),

        // ── Brazil (26 states + DF) ────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000124"), "states.saoPaulo",     Brazil),
        new(new Guid("00000003-0000-0000-0000-000000000125"), "states.rioDeJaneiro", Brazil),
        new(new Guid("00000003-0000-0000-0000-000000000126"), "states.minasGerais",  Brazil),
        new(new Guid("00000003-0000-0000-0000-000000000127"), "states.bahia",        Brazil),
        new(new Guid("00000003-0000-0000-0000-000000000128"), "states.parana",       Brazil),

        // ── Morocco (12 regions) ───────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000129"), "states.casablancaSettat",   Morocco),
        new(new Guid("00000003-0000-0000-0000-000000000130"), "states.rabatSaleKenitra",   Morocco),
        new(new Guid("00000003-0000-0000-0000-000000000131"), "states.marrakechSafi",      Morocco),
        new(new Guid("00000003-0000-0000-0000-000000000132"), "states.fesMeknes",          Morocco),
        new(new Guid("00000003-0000-0000-0000-000000000133"), "states.tangerTetouan",      Morocco),
        new(new Guid("00000003-0000-0000-0000-000000000134"), "states.sousseMassa",        Morocco),

        // ── Egypt (27 governorates) ────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000135"), "states.cairo",           Egypt),
        new(new Guid("00000003-0000-0000-0000-000000000136"), "states.alexandria",      Egypt),
        new(new Guid("00000003-0000-0000-0000-000000000137"), "states.giza",            Egypt),
        new(new Guid("00000003-0000-0000-0000-000000000138"), "states.luxor",           Egypt),
        new(new Guid("00000003-0000-0000-0000-000000000139"), "states.aswan",           Egypt),
        new(new Guid("00000003-0000-0000-0000-000000000140"), "states.portSaid",        Egypt),
        new(new Guid("00000003-0000-0000-0000-000000000141"), "states.suez",            Egypt),
        new(new Guid("00000003-0000-0000-0000-000000000142"), "states.ismailia",        Egypt),
        new(new Guid("00000003-0000-0000-0000-000000000143"), "states.sharkia",         Egypt),
        new(new Guid("00000003-0000-0000-0000-000000000144"), "states.dakahlia",        Egypt),
        new(new Guid("00000003-0000-0000-0000-000000000145"), "states.beheira",         Egypt),

        // ── Saudi Arabia (13 regions) ─────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000146"), "states.riyadh",          SaudiArabia),
        new(new Guid("00000003-0000-0000-0000-000000000147"), "states.makkah",          SaudiArabia),
        new(new Guid("00000003-0000-0000-0000-000000000148"), "states.madinah",         SaudiArabia),
        new(new Guid("00000003-0000-0000-0000-000000000149"), "states.easternProvince", SaudiArabia),
        new(new Guid("00000003-0000-0000-0000-000000000150"), "states.asir",            SaudiArabia),
        new(new Guid("00000003-0000-0000-0000-000000000151"), "states.jizan",           SaudiArabia),
        new(new Guid("00000003-0000-0000-0000-000000000152"), "states.tabuk",           SaudiArabia),
        new(new Guid("00000003-0000-0000-0000-000000000153"), "states.hail",            SaudiArabia),
        new(new Guid("00000003-0000-0000-0000-000000000154"), "states.najran",          SaudiArabia),

        // ── Turkey (7 geographical regions) ───────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000155"), "states.istanbul",   Turkey),
        new(new Guid("00000003-0000-0000-0000-000000000156"), "states.ankara",     Turkey),
        new(new Guid("00000003-0000-0000-0000-000000000157"), "states.izmir",      Turkey),
        new(new Guid("00000003-0000-0000-0000-000000000158"), "states.antalya",    Turkey),
        new(new Guid("00000003-0000-0000-0000-000000000159"), "states.bursa",      Turkey),
        new(new Guid("00000003-0000-0000-0000-000000000160"), "states.adana",      Turkey),
        new(new Guid("00000003-0000-0000-0000-000000000161"), "states.gaziantep",  Turkey),

        // ── Spain (17 autonomous communities) ─────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000162"), "states.madrid",            Spain),
        new(new Guid("00000003-0000-0000-0000-000000000163"), "states.catalonia",         Spain),
        new(new Guid("00000003-0000-0000-0000-000000000164"), "states.andalusia",         Spain),
        new(new Guid("00000003-0000-0000-0000-000000000165"), "states.valencia",          Spain),
        new(new Guid("00000003-0000-0000-0000-000000000166"), "states.galicia",           Spain),
        new(new Guid("00000003-0000-0000-0000-000000000167"), "states.basqueCountry",     Spain),
        new(new Guid("00000003-0000-0000-0000-000000000168"), "states.castilleAndLeon",   Spain),
        new(new Guid("00000003-0000-0000-0000-000000000169"), "states.aragon",            Spain),

        // ── Italy (20 regions) ─────────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000170"), "states.lombardy",  Italy),
        new(new Guid("00000003-0000-0000-0000-000000000171"), "states.lazio",     Italy),
        new(new Guid("00000003-0000-0000-0000-000000000172"), "states.campania",  Italy),
        new(new Guid("00000003-0000-0000-0000-000000000173"), "states.veneto",    Italy),
        new(new Guid("00000003-0000-0000-0000-000000000174"), "states.piedmont",  Italy),
        new(new Guid("00000003-0000-0000-0000-000000000175"), "states.sicily",    Italy),
        new(new Guid("00000003-0000-0000-0000-000000000176"), "states.tuscany",   Italy),
        new(new Guid("00000003-0000-0000-0000-000000000177"), "states.sardinia",  Italy),

        // ── Algeria (48 wilayas) ───────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000178"), "states.algiers",       Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000179"), "states.oran",          Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000180"), "states.constantine",   Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000181"), "states.annaba",        Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000182"), "states.batna",         Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000183"), "states.setif",         Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000184"), "states.bejaia",        Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000185"), "states.tlemcen",       Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000186"), "states.blida",         Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000187"), "states.tiziOuzou",     Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000188"), "states.sidi_bel_abbes", Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000189"), "states.biskra",        Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000190"), "states.tebessa",       Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000191"), "states.jijel",         Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000192"), "states.skikda",        Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000193"), "states.guelma",        Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000194"), "states.souk_ahras",    Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000195"), "states.khenchela",     Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000196"), "states.ouargla",       Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000197"), "states.ghardaia",      Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000198"), "states.bechar",        Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000199"), "states.adrar",         Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000200"), "states.tamanrasset",   Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000201"), "states.msila",         Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000202"), "states.medea",         Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000203"), "states.bouira",        Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000204"), "states.boumerdes",     Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000205"), "states.tipaza",        Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000206"), "states.ain_defla",     Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000207"), "states.relizane",      Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000208"), "states.djelfa",        Algeria),
        new(new Guid("00000003-0000-0000-0000-000000000209"), "states.tiaret",        Algeria),

        // ── UAE (7 emirates) ───────────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000210"), "states.dubai",         UAE),
        new(new Guid("00000003-0000-0000-0000-000000000211"), "states.abuDhabi",      UAE),
        new(new Guid("00000003-0000-0000-0000-000000000212"), "states.sharjah",       UAE),
        new(new Guid("00000003-0000-0000-0000-000000000213"), "states.ajman",         UAE),
        new(new Guid("00000003-0000-0000-0000-000000000214"), "states.fujairah",      UAE),
        new(new Guid("00000003-0000-0000-0000-000000000215"), "states.rasAlKhaimah",  UAE),
        new(new Guid("00000003-0000-0000-0000-000000000216"), "states.ummAlQuwain",   UAE),

        // ── Libya (key districts) ──────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000217"), "states.tripoli",        Libya),
        new(new Guid("00000003-0000-0000-0000-000000000218"), "states.benghazi",       Libya),
        new(new Guid("00000003-0000-0000-0000-000000000219"), "states.misrata",        Libya),
        new(new Guid("00000003-0000-0000-0000-000000000220"), "states.zintan",         Libya),
        new(new Guid("00000003-0000-0000-0000-000000000221"), "states.sirte",          Libya),
        new(new Guid("00000003-0000-0000-0000-000000000222"), "states.derna",          Libya),
        new(new Guid("00000003-0000-0000-0000-000000000223"), "states.tobruk",         Libya),
        new(new Guid("00000003-0000-0000-0000-000000000224"), "states.sabha",          Libya),
        new(new Guid("00000003-0000-0000-0000-000000000225"), "states.zawiya",         Libya),
        new(new Guid("00000003-0000-0000-0000-000000000226"), "states.zuwara",         Libya),

        // ── Iraq (18 governorates) ─────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000227"), "states.baghdad",        Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000228"), "states.basra",          Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000229"), "states.ninawa",         Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000230"), "states.erbil",          Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000231"), "states.sulaymaniyah",   Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000232"), "states.duhok",          Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000233"), "states.kirkuk",         Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000234"), "states.anbar",          Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000235"), "states.diyala",         Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000236"), "states.babil",          Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000237"), "states.karbala",        Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000238"), "states.najaf",          Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000239"), "states.wasit",          Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000240"), "states.diwaniyah",      Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000241"), "states.muthanna",       Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000242"), "states.dhiqar",         Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000243"), "states.maysan",         Iraq),
        new(new Guid("00000003-0000-0000-0000-000000000244"), "states.salahaldin",     Iraq),

        // ── Jordan (12 governorates) ───────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000245"), "states.amman",          Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000246"), "states.zarqa",          Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000247"), "states.irbid",          Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000248"), "states.balqa",          Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000249"), "states.aqaba",          Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000250"), "states.mafraq",         Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000251"), "states.karak",          Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000252"), "states.tafilah",        Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000253"), "states.maan",           Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000254"), "states.jerash",         Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000255"), "states.ajloun",         Jordan),
        new(new Guid("00000003-0000-0000-0000-000000000256"), "states.madaba",         Jordan),

        // ── Lebanon (8 governorates) ───────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000257"), "states.beirut",         Lebanon),
        new(new Guid("00000003-0000-0000-0000-000000000258"), "states.mountLebanon",   Lebanon),
        new(new Guid("00000003-0000-0000-0000-000000000259"), "states.northLebanon",   Lebanon),
        new(new Guid("00000003-0000-0000-0000-000000000260"), "states.southLebanon",   Lebanon),
        new(new Guid("00000003-0000-0000-0000-000000000261"), "states.bekaa",          Lebanon),
        new(new Guid("00000003-0000-0000-0000-000000000262"), "states.nabatieh",       Lebanon),
        new(new Guid("00000003-0000-0000-0000-000000000263"), "states.akkar",          Lebanon),
        new(new Guid("00000003-0000-0000-0000-000000000264"), "states.baalbek",        Lebanon),

        // ── Syria (14 governorates) ────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000265"), "states.damascus",       Syria),
        new(new Guid("00000003-0000-0000-0000-000000000266"), "states.aleppo",         Syria),
        new(new Guid("00000003-0000-0000-0000-000000000267"), "states.homs",           Syria),
        new(new Guid("00000003-0000-0000-0000-000000000268"), "states.hama",           Syria),
        new(new Guid("00000003-0000-0000-0000-000000000269"), "states.latakia",        Syria),
        new(new Guid("00000003-0000-0000-0000-000000000270"), "states.deir_ez_zor",    Syria),
        new(new Guid("00000003-0000-0000-0000-000000000271"), "states.raqqa",          Syria),
        new(new Guid("00000003-0000-0000-0000-000000000272"), "states.daraa",          Syria),
        new(new Guid("00000003-0000-0000-0000-000000000273"), "states.idlib",          Syria),
        new(new Guid("00000003-0000-0000-0000-000000000274"), "states.hasakah",        Syria),
        new(new Guid("00000003-0000-0000-0000-000000000275"), "states.tartus",         Syria),
        new(new Guid("00000003-0000-0000-0000-000000000276"), "states.sweida",         Syria),
        new(new Guid("00000003-0000-0000-0000-000000000277"), "states.quneitra",       Syria),
        new(new Guid("00000003-0000-0000-0000-000000000278"), "states.riefDamascus",   Syria),

        // ── Sudan (18 states) ──────────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000279"), "states.khartoum",       Sudan),
        new(new Guid("00000003-0000-0000-0000-000000000280"), "states.omdurman",       Sudan),
        new(new Guid("00000003-0000-0000-0000-000000000281"), "states.portSudan",      Sudan),
        new(new Guid("00000003-0000-0000-0000-000000000282"), "states.kassala",        Sudan),
        new(new Guid("00000003-0000-0000-0000-000000000283"), "states.gedaref",        Sudan),
        new(new Guid("00000003-0000-0000-0000-000000000284"), "states.wad_madani",     Sudan),
        new(new Guid("00000003-0000-0000-0000-000000000285"), "states.elobeid",        Sudan),
        new(new Guid("00000003-0000-0000-0000-000000000286"), "states.nyala",          Sudan),
        new(new Guid("00000003-0000-0000-0000-000000000287"), "states.el_fasher",      Sudan),
        new(new Guid("00000003-0000-0000-0000-000000000288"), "states.atbara",         Sudan),

        // ── Yemen (21 governorates) ────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000289"), "states.sanaa",          Yemen),
        new(new Guid("00000003-0000-0000-0000-000000000290"), "states.aden",           Yemen),
        new(new Guid("00000003-0000-0000-0000-000000000291"), "states.taiz",           Yemen),
        new(new Guid("00000003-0000-0000-0000-000000000292"), "states.hodeidah",       Yemen),
        new(new Guid("00000003-0000-0000-0000-000000000293"), "states.ibb",            Yemen),
        new(new Guid("00000003-0000-0000-0000-000000000294"), "states.hadramawt",      Yemen),
        new(new Guid("00000003-0000-0000-0000-000000000295"), "states.marib",          Yemen),
        new(new Guid("00000003-0000-0000-0000-000000000296"), "states.hajjah",         Yemen),
        new(new Guid("00000003-0000-0000-0000-000000000297"), "states.dhamar",         Yemen),
        new(new Guid("00000003-0000-0000-0000-000000000298"), "states.lahj",           Yemen),
        new(new Guid("00000003-0000-0000-0000-000000000299"), "states.abyan",          Yemen),

        // ── Qatar (8 municipalities) ───────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000300"), "states.doha",           Qatar),
        new(new Guid("00000003-0000-0000-0000-000000000301"), "states.rayyan",         Qatar),
        new(new Guid("00000003-0000-0000-0000-000000000302"), "states.wakra",          Qatar),
        new(new Guid("00000003-0000-0000-0000-000000000303"), "states.shamal",         Qatar),
        new(new Guid("00000003-0000-0000-0000-000000000304"), "states.zayan",          Qatar),
        new(new Guid("00000003-0000-0000-0000-000000000305"), "states.khor",           Qatar),
        new(new Guid("00000003-0000-0000-0000-000000000306"), "states.umm_salal",      Qatar),
        new(new Guid("00000003-0000-0000-0000-000000000307"), "states.daayen",         Qatar),

        // ── Kuwait (6 governorates) ────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000308"), "states.capital",        Kuwait),
        new(new Guid("00000003-0000-0000-0000-000000000309"), "states.hawalli",        Kuwait),
        new(new Guid("00000003-0000-0000-0000-000000000310"), "states.farwaniya",      Kuwait),
        new(new Guid("00000003-0000-0000-0000-000000000311"), "states.ahmadi",         Kuwait),
        new(new Guid("00000003-0000-0000-0000-000000000312"), "states.mubarak",        Kuwait),
        new(new Guid("00000003-0000-0000-0000-000000000313"), "states.jahra",          Kuwait),

        // ── Oman (11 governorates) ─────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000314"), "states.muscat",         Oman),
        new(new Guid("00000003-0000-0000-0000-000000000315"), "states.dhofar",         Oman),
        new(new Guid("00000003-0000-0000-0000-000000000316"), "states.musandam",       Oman),
        new(new Guid("00000003-0000-0000-0000-000000000317"), "states.al_buraymi",     Oman),
        new(new Guid("00000003-0000-0000-0000-000000000318"), "states.ad_dakhiliyah",  Oman),
        new(new Guid("00000003-0000-0000-0000-000000000319"), "states.al_batinah",     Oman),
        new(new Guid("00000003-0000-0000-0000-000000000320"), "states.ash_sharqiyah",  Oman),
        new(new Guid("00000003-0000-0000-0000-000000000321"), "states.al_wusta",       Oman),
        new(new Guid("00000003-0000-0000-0000-000000000322"), "states.az_zahirah",     Oman),
        new(new Guid("00000003-0000-0000-0000-000000000323"), "states.al_dhahira",     Oman),

        // ── Bahrain (4 governorates) ───────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000324"), "states.manama",         Bahrain),
        new(new Guid("00000003-0000-0000-0000-000000000325"), "states.muharraq",       Bahrain),
        new(new Guid("00000003-0000-0000-0000-000000000326"), "states.northern",       Bahrain),
        new(new Guid("00000003-0000-0000-0000-000000000327"), "states.southern",       Bahrain),

        // ── Mexico (32 states) ─────────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000328"), "states.mexicoCity",     Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000329"), "states.jalisco",        Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000330"), "states.nuevoLeon",      Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000331"), "states.puebla",         Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000332"), "states.guanajuato",     Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000333"), "states.chihuahua",      Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000334"), "states.veracruz",       Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000335"), "states.sonora",         Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000336"), "states.coahuila",       Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000337"), "states.michoacan",      Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000338"), "states.oaxaca",         Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000339"), "states.tamaulipas",     Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000340"), "states.guerrero",       Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000341"), "states.sinaloa",        Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000342"), "states.yucatan",        Mexico),
        new(new Guid("00000003-0000-0000-0000-000000000343"), "states.quintanaRoo",    Mexico),

        // ── Argentina (23 provinces + CABA) ───────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000344"), "states.buenosAires",    Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000345"), "states.cordoba",        Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000346"), "states.santaFe",        Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000347"), "states.mendoza",        Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000348"), "states.tucuman",        Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000349"), "states.salta",          Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000350"), "states.misiones",       Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000351"), "states.santiagoDelEstero", Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000352"), "states.sanJuan",        Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000353"), "states.jujuy",          Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000354"), "states.rioNegro",       Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000355"), "states.chubut",         Argentina),
        new(new Guid("00000003-0000-0000-0000-000000000356"), "states.santaCruz",      Argentina),

        // ── South Africa (9 provinces) ─────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000357"), "states.gauteng",            SouthAfrica),
        new(new Guid("00000003-0000-0000-0000-000000000358"), "states.westernCape",        SouthAfrica),
        new(new Guid("00000003-0000-0000-0000-000000000359"), "states.kwazuluNatal",       SouthAfrica),
        new(new Guid("00000003-0000-0000-0000-000000000360"), "states.easternCape",        SouthAfrica),
        new(new Guid("00000003-0000-0000-0000-000000000361"), "states.limpopo",            SouthAfrica),
        new(new Guid("00000003-0000-0000-0000-000000000362"), "states.mpumalanga",         SouthAfrica),
        new(new Guid("00000003-0000-0000-0000-000000000363"), "states.northWest",          SouthAfrica),
        new(new Guid("00000003-0000-0000-0000-000000000364"), "states.freeState",          SouthAfrica),
        new(new Guid("00000003-0000-0000-0000-000000000365"), "states.northernCape",       SouthAfrica),

        // ── Nigeria (key states) ───────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000366"), "states.lagos",          Nigeria),
        new(new Guid("00000003-0000-0000-0000-000000000367"), "states.kano",           Nigeria),
        new(new Guid("00000003-0000-0000-0000-000000000368"), "states.ibadan",         Nigeria),
        new(new Guid("00000003-0000-0000-0000-000000000369"), "states.abuja",          Nigeria),
        new(new Guid("00000003-0000-0000-0000-000000000370"), "states.port_harcourt",  Nigeria),
        new(new Guid("00000003-0000-0000-0000-000000000371"), "states.enugu",          Nigeria),
        new(new Guid("00000003-0000-0000-0000-000000000372"), "states.kaduna",         Nigeria),
        new(new Guid("00000003-0000-0000-0000-000000000373"), "states.borno",          Nigeria),
        new(new Guid("00000003-0000-0000-0000-000000000374"), "states.rivers",         Nigeria),
        new(new Guid("00000003-0000-0000-0000-000000000375"), "states.oyo",            Nigeria),

        // ── Japan (key regions) ────────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000376"), "states.tokyo",          Japan),
        new(new Guid("00000003-0000-0000-0000-000000000377"), "states.osaka",          Japan),
        new(new Guid("00000003-0000-0000-0000-000000000378"), "states.kyoto",          Japan),
        new(new Guid("00000003-0000-0000-0000-000000000379"), "states.aichi",          Japan),
        new(new Guid("00000003-0000-0000-0000-000000000380"), "states.kanagawa",       Japan),
        new(new Guid("00000003-0000-0000-0000-000000000381"), "states.saitama",        Japan),
        new(new Guid("00000003-0000-0000-0000-000000000382"), "states.chiba",          Japan),
        new(new Guid("00000003-0000-0000-0000-000000000383"), "states.hokkaido",       Japan),

        // ── China (key provinces/municipalities) ──────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000384"), "states.beijing",        China),
        new(new Guid("00000003-0000-0000-0000-000000000385"), "states.shanghai",       China),
        new(new Guid("00000003-0000-0000-0000-000000000386"), "states.guangdong",      China),
        new(new Guid("00000003-0000-0000-0000-000000000387"), "states.sichuan",        China),
        new(new Guid("00000003-0000-0000-0000-000000000388"), "states.zhejiang",       China),
        new(new Guid("00000003-0000-0000-0000-000000000389"), "states.jiangsu",        China),
        new(new Guid("00000003-0000-0000-0000-000000000390"), "states.hubei",          China),
        new(new Guid("00000003-0000-0000-0000-000000000391"), "states.henan",          China),
        new(new Guid("00000003-0000-0000-0000-000000000392"), "states.chongqing",      China),
        new(new Guid("00000003-0000-0000-0000-000000000393"), "states.fujian",         China),

        // ── Russia (key federal subjects) ─────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000394"), "states.moscow",         Russia),
        new(new Guid("00000003-0000-0000-0000-000000000395"), "states.stPetersburg",   Russia),
        new(new Guid("00000003-0000-0000-0000-000000000396"), "states.novosibirsk",    Russia),
        new(new Guid("00000003-0000-0000-0000-000000000397"), "states.yekaterinburg",  Russia),
        new(new Guid("00000003-0000-0000-0000-000000000398"), "states.kazan",          Russia),
        new(new Guid("00000003-0000-0000-0000-000000000399"), "states.nizhnyNovgorod", Russia),
        new(new Guid("00000003-0000-0000-0000-000000000400"), "states.chelyabinsk",    Russia),
        new(new Guid("00000003-0000-0000-0000-000000000401"), "states.samara",         Russia),

        // ── Pakistan (5 provinces + 2 territories) ────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000402"), "states.punjab",         Pakistan),
        new(new Guid("00000003-0000-0000-0000-000000000403"), "states.sindh",          Pakistan),
        new(new Guid("00000003-0000-0000-0000-000000000404"), "states.kpk",            Pakistan),
        new(new Guid("00000003-0000-0000-0000-000000000405"), "states.balochistan",    Pakistan),
        new(new Guid("00000003-0000-0000-0000-000000000406"), "states.islamabad",      Pakistan),

        // ── Malaysia (13 states + 3 FTs) ──────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000407"), "states.kualaLumpur",    Malaysia),
        new(new Guid("00000003-0000-0000-0000-000000000408"), "states.selangor",       Malaysia),
        new(new Guid("00000003-0000-0000-0000-000000000409"), "states.johor",          Malaysia),
        new(new Guid("00000003-0000-0000-0000-000000000410"), "states.perak",          Malaysia),
        new(new Guid("00000003-0000-0000-0000-000000000411"), "states.penang",         Malaysia),
        new(new Guid("00000003-0000-0000-0000-000000000412"), "states.sabah",          Malaysia),
        new(new Guid("00000003-0000-0000-0000-000000000413"), "states.sarawak",        Malaysia),
        new(new Guid("00000003-0000-0000-0000-000000000414"), "states.kedah",          Malaysia),
        new(new Guid("00000003-0000-0000-0000-000000000415"), "states.kelantan",       Malaysia),
        new(new Guid("00000003-0000-0000-0000-000000000416"), "states.pahang",         Malaysia),

        // ── Poland (16 voivodeships) ───────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000417"), "states.masovian",       Poland),
        new(new Guid("00000003-0000-0000-0000-000000000418"), "states.silesian",       Poland),
        new(new Guid("00000003-0000-0000-0000-000000000419"), "states.greaterPoland",  Poland),
        new(new Guid("00000003-0000-0000-0000-000000000420"), "states.lesserPoland",   Poland),
        new(new Guid("00000003-0000-0000-0000-000000000421"), "states.lowerSilesian",  Poland),
        new(new Guid("00000003-0000-0000-0000-000000000422"), "states.lodz",           Poland),
        new(new Guid("00000003-0000-0000-0000-000000000423"), "states.pomeranian",     Poland),
        new(new Guid("00000003-0000-0000-0000-000000000424"), "states.kuyavian",       Poland),
        new(new Guid("00000003-0000-0000-0000-000000000425"), "states.lublin",         Poland),
        new(new Guid("00000003-0000-0000-0000-000000000426"), "states.subcarpathian",  Poland),
        new(new Guid("00000003-0000-0000-0000-000000000427"), "states.podlaskie",      Poland),
        new(new Guid("00000003-0000-0000-0000-000000000428"), "states.warmian",        Poland),

        // ── Netherlands (12 provinces) ─────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000429"), "states.northHolland",   Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000430"), "states.southHolland",   Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000431"), "states.utrecht",        Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000432"), "states.northBrabant",   Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000433"), "states.gelderland",     Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000434"), "states.zeeland",        Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000435"), "states.friesland",      Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000436"), "states.groningen",      Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000437"), "states.drenthe",        Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000438"), "states.overijssel",     Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000439"), "states.flevoland",      Netherlands),
        new(new Guid("00000003-0000-0000-0000-000000000440"), "states.limburg",        Netherlands),

        // ── Belgium (3 regions) ────────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000441"), "states.brussels",       Belgium),
        new(new Guid("00000003-0000-0000-0000-000000000442"), "states.flanders",       Belgium),
        new(new Guid("00000003-0000-0000-0000-000000000443"), "states.wallonia",       Belgium),

        // ── Portugal (7 regions) ───────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000444"), "states.lisbon",         Portugal),
        new(new Guid("00000003-0000-0000-0000-000000000445"), "states.porto",          Portugal),
        new(new Guid("00000003-0000-0000-0000-000000000446"), "states.centro",         Portugal),
        new(new Guid("00000003-0000-0000-0000-000000000447"), "states.alentejoRegion", Portugal),
        new(new Guid("00000003-0000-0000-0000-000000000448"), "states.algarve",        Portugal),
        new(new Guid("00000003-0000-0000-0000-000000000449"), "states.azores",         Portugal),
        new(new Guid("00000003-0000-0000-0000-000000000450"), "states.madeira",        Portugal),

        // ── Greece (7 decentralized administrations) ──────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000451"), "states.attica",         Greece),
        new(new Guid("00000003-0000-0000-0000-000000000452"), "states.centralMacedonia", Greece),
        new(new Guid("00000003-0000-0000-0000-000000000453"), "states.thessaly",       Greece),
        new(new Guid("00000003-0000-0000-0000-000000000454"), "states.westernGreece",  Greece),
        new(new Guid("00000003-0000-0000-0000-000000000455"), "states.peloponnese",    Greece),
        new(new Guid("00000003-0000-0000-0000-000000000456"), "states.crete",          Greece),
        new(new Guid("00000003-0000-0000-0000-000000000457"), "states.ionian",         Greece),

        // ── Austria (9 federal states) ─────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000458"), "states.vienna",         Austria),
        new(new Guid("00000003-0000-0000-0000-000000000459"), "states.lowerAustria",   Austria),
        new(new Guid("00000003-0000-0000-0000-000000000460"), "states.upperAustria",   Austria),
        new(new Guid("00000003-0000-0000-0000-000000000461"), "states.styria",         Austria),
        new(new Guid("00000003-0000-0000-0000-000000000462"), "states.tyrol",          Austria),
        new(new Guid("00000003-0000-0000-0000-000000000463"), "states.carinthia",      Austria),
        new(new Guid("00000003-0000-0000-0000-000000000464"), "states.salzburg",       Austria),
        new(new Guid("00000003-0000-0000-0000-000000000465"), "states.vorarlberg",     Austria),
        new(new Guid("00000003-0000-0000-0000-000000000466"), "states.burgenland",     Austria),

        // ── Bangladesh (8 divisions) ───────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000467"), "states.dhaka",          Bangladesh),
        new(new Guid("00000003-0000-0000-0000-000000000468"), "states.chittagong",     Bangladesh),
        new(new Guid("00000003-0000-0000-0000-000000000469"), "states.sylhet",         Bangladesh),
        new(new Guid("00000003-0000-0000-0000-000000000470"), "states.rajshahi",       Bangladesh),
        new(new Guid("00000003-0000-0000-0000-000000000471"), "states.khulna",         Bangladesh),
        new(new Guid("00000003-0000-0000-0000-000000000472"), "states.barisal",        Bangladesh),
        new(new Guid("00000003-0000-0000-0000-000000000473"), "states.mymensingh",     Bangladesh),
        new(new Guid("00000003-0000-0000-0000-000000000474"), "states.rangpur",        Bangladesh),

        // ── Indonesia (key provinces) ──────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000475"), "states.westJava",       Indonesia),
        new(new Guid("00000003-0000-0000-0000-000000000476"), "states.centralJava",    Indonesia),
        new(new Guid("00000003-0000-0000-0000-000000000477"), "states.eastJava",       Indonesia),
        new(new Guid("00000003-0000-0000-0000-000000000478"), "states.northSumatra",   Indonesia),
        new(new Guid("00000003-0000-0000-0000-000000000479"), "states.southSulawesi",  Indonesia),
        new(new Guid("00000003-0000-0000-0000-000000000480"), "states.bali",           Indonesia),
        new(new Guid("00000003-0000-0000-0000-000000000481"), "states.dkiJakarta",     Indonesia),

        // ── Colombia (key departments) ─────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000482"), "states.cundinamarca",   Colombia),
        new(new Guid("00000003-0000-0000-0000-000000000483"), "states.antioquia",      Colombia),
        new(new Guid("00000003-0000-0000-0000-000000000484"), "states.valledDelCauca", Colombia),
        new(new Guid("00000003-0000-0000-0000-000000000485"), "states.atlantico",      Colombia),
        new(new Guid("00000003-0000-0000-0000-000000000486"), "states.bolivar",        Colombia),
        new(new Guid("00000003-0000-0000-0000-000000000487"), "states.santander",      Colombia),
        new(new Guid("00000003-0000-0000-0000-000000000488"), "states.cordova_col",    Colombia),
        new(new Guid("00000003-0000-0000-0000-000000000489"), "states.cauca",          Colombia),
        new(new Guid("00000003-0000-0000-0000-000000000490"), "states.nariño",         Colombia),
        new(new Guid("00000003-0000-0000-0000-000000000491"), "states.boyaca",         Colombia),

        // ── Ukraine (key oblasts) ──────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000492"), "states.kyiv",           Ukraine),
        new(new Guid("00000003-0000-0000-0000-000000000493"), "states.kharkiv",        Ukraine),
        new(new Guid("00000003-0000-0000-0000-000000000494"), "states.dnipro",         Ukraine),
        new(new Guid("00000003-0000-0000-0000-000000000495"), "states.odessa",         Ukraine),
        new(new Guid("00000003-0000-0000-0000-000000000496"), "states.lviv",           Ukraine),
        new(new Guid("00000003-0000-0000-0000-000000000497"), "states.zaporizhzhia",   Ukraine),
        new(new Guid("00000003-0000-0000-0000-000000000498"), "states.kryvyiRih",      Ukraine),
        new(new Guid("00000003-0000-0000-0000-000000000499"), "states.donetsk",        Ukraine),

        // ── Iran (key provinces) ───────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000500"), "states.tehran",         Iran),
        new(new Guid("00000003-0000-0000-0000-000000000501"), "states.isfahan",        Iran),
        new(new Guid("00000003-0000-0000-0000-000000000502"), "states.fars",           Iran),
        new(new Guid("00000003-0000-0000-0000-000000000503"), "states.razavi",         Iran),
        new(new Guid("00000003-0000-0000-0000-000000000504"), "states.eastAzerbaijan", Iran),
        new(new Guid("00000003-0000-0000-0000-000000000505"), "states.khuzestan",      Iran),
        new(new Guid("00000003-0000-0000-0000-000000000506"), "states.kermanshah",     Iran),
        new(new Guid("00000003-0000-0000-0000-000000000507"), "states.alborz",         Iran),

        // ── Sweden (key counties) ──────────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000508"), "states.stockholmCounty",   Sweden),
        new(new Guid("00000003-0000-0000-0000-000000000509"), "states.vastraGotaland",    Sweden),
        new(new Guid("00000003-0000-0000-0000-000000000510"), "states.skane",             Sweden),
        new(new Guid("00000003-0000-0000-0000-000000000511"), "states.ostergotland",      Sweden),
        new(new Guid("00000003-0000-0000-0000-000000000512"), "states.vasterbotten",      Sweden),

        // ── Switzerland (key cantons) ──────────────────────────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000513"), "states.zurich",         Switzerland),
        new(new Guid("00000003-0000-0000-0000-000000000514"), "states.bern",           Switzerland),
        new(new Guid("00000003-0000-0000-0000-000000000515"), "states.vaud",           Switzerland),
        new(new Guid("00000003-0000-0000-0000-000000000516"), "states.geneva",         Switzerland),
        new(new Guid("00000003-0000-0000-0000-000000000517"), "states.aargau",         Switzerland),
        new(new Guid("00000003-0000-0000-0000-000000000518"), "states.basel",          Switzerland),

        // ── South Korea (key provinces/metropolitan cities) ────────────────────
        new(new Guid("00000003-0000-0000-0000-000000000519"), "states.seoul",          SouthKorea),
        new(new Guid("00000003-0000-0000-0000-000000000520"), "states.busan",          SouthKorea),
        new(new Guid("00000003-0000-0000-0000-000000000521"), "states.incheon",        SouthKorea),
        new(new Guid("00000003-0000-0000-0000-000000000522"), "states.daegu",          SouthKorea),
        new(new Guid("00000003-0000-0000-0000-000000000523"), "states.daejeon",        SouthKorea),
        new(new Guid("00000003-0000-0000-0000-000000000524"), "states.gwangju",        SouthKorea),
        new(new Guid("00000003-0000-0000-0000-000000000525"), "states.gyeonggi",       SouthKorea),
        new(new Guid("00000003-0000-0000-0000-000000000526"), "states.gyeongnam",      SouthKorea),
    ];
}
