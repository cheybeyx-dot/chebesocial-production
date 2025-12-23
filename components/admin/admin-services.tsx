"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/firebase/firebaseConfig";
import { Language, translations } from "@/lib/languageEnglishApi/translations";
import { translateServices } from "@/lib/languageEnglishApi/translate-service-data";

interface Services {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
  iconPath: string;
}

export default function AdminServices() {
  const [services, setServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(true);
  const [excludedServices, setExcludedServices] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [originalServices, setOriginalServices] = useState<Services[]>([]);

  const t = translations[language];
  const itemsPerPage = 10;

  // Fetch services and excluded services on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from your API
        const response = await fetch("/admin/api/services");
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        setOriginalServices(data);
        setServices(translateServices(data, language));

        // Fetch excluded services from Firestore
        const excludedDoc = await getDoc(
          doc(db, "settings", "excludedServices")
        );
        if (excludedDoc.exists()) {
          setExcludedServices(excludedDoc.data().serviceIds || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  // Update translations when language changes
  useEffect(() => {
    if (originalServices.length > 0) {
      setServices(translateServices(originalServices, language));
    }
  }, [language, originalServices]);

  // Filter services based on search term
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.service.toString().includes(searchTerm)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Toggle service selection
  const toggleService = (serviceId: number) => {
    setExcludedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Save excluded services to Firestore
  const saveExcludedServices = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, "settings", "excludedServices"), {
        serviceIds: excludedServices,
        updatedAt: new Date(),
      });
      alert("Excluded services saved successfully!");
    } catch (error) {
      console.error("Error saving excluded services:", error);
      alert("Error saving excluded services. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    // First page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Pages around current
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className={
            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
          }
        />
      </PaginationItem>
    );

    return items;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">{t.loading}</div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Globe size={16} />
              {language === "en" ? "English" : "Français"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("en")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("fr")}>
              Français
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10"
          />
        </div>
        <Button
          onClick={saveExcludedServices}
          disabled={saving}
          className="min-w-[120px] bg-blue-500 hover:bg-blue-600 text-white"
        >
          {saving ? t.saving : t.saveButton}
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">{t.excludeColumn}</TableHead>
              <TableHead className="w-[100px]">{t.idColumn}</TableHead>
              <TableHead>{t.nameColumn}</TableHead>
              <TableHead>{t.categoryColumn}</TableHead>
              <TableHead className="w-[100px]">{t.rateColumn}</TableHead>
              <TableHead className="w-[100px]">{t.minColumn}</TableHead>
              <TableHead className="w-[100px]">{t.maxColumn}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedServices.length > 0 ? (
              paginatedServices.map((service) => (
                <TableRow key={service.service}>
                  <TableCell>
                    <Checkbox
                      checked={excludedServices.includes(Number(service.service))}
                      onCheckedChange={() => toggleService(Number(service.service))}
                    />
                  </TableCell>
                  <TableCell>{service.service}</TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.rate}</TableCell>
                  <TableCell>{service.min}</TableCell>
                  <TableCell>{service.max}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  {t.noServicesFound}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredServices.length > 0 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>{renderPaginationItems()}</PaginationContent>
          </Pagination>
          <div className="text-sm mt-2 text-center">
            {t.showing} {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, filteredServices.length)}{" "}
            {t.of} {filteredServices.length} {t.services}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">{t.excludedServiceIds}</h2>
        <div className="flex flex-wrap gap-2">
          {excludedServices.length > 0 ? (
            excludedServices.map((id) => (
              <div
                key={id}
                className="px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{id}</span>
                <button
                  onClick={() => toggleService(id)}
                  className="hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p className="">{t.noServicesExcluded}</p>
          )}
        </div>
      </div>
    </div>
  );
}
